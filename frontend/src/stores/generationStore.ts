import { create } from 'zustand';

import { API_BASE_URL, apiClient } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import type {
  GenerationState,
  GenerationActions,
  GenerationRequest,
  GenerationJob,
  GenerationResponse,
  GenerationResult,
  ProgressEventData,
  DoneEventData,
  ErrorEventData,
} from '@/types/generation';

type GenerationStore = GenerationState & GenerationActions;

export const useGenerationStore = create<GenerationStore>((set, get) => ({
  // State
  currentJob: null,
  isLoading: false,
  error: null,
  isGenerating: false,

  // Actions
  createJob: async (request: GenerationRequest): Promise<string> => {
    set({ isLoading: true, error: null });

    try {
      const { token } = useAuthStore.getState();

      const response = await apiClient.post<GenerationResponse>(
        '/api/generate/',
        {
          prompt: request.prompt,
          num_images: request.numImages,
        },
        token || ''
      );

      // Initialize job with pending results
      const initialResults: GenerationResult[] = Array.from(
        { length: request.numImages },
        (_, index) => ({
          index,
          status: 'pending' as const,
        })
      );

      const job: GenerationJob = {
        jobId: response.job_id,
        prompt: request.prompt,
        numImages: request.numImages,
        status: 'pending',
        results: initialResults,
        createdAt: new Date().toISOString(),
      };

      set({
        currentJob: job,
        isLoading: false,
        isGenerating: true,
        error: null,
      });

      // Start SSE subscription
      get().subscribeToJob(response.job_id);

      return response.job_id;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to create image generation job. Please try again.';

      set({
        isLoading: false,
        error: errorMessage,
        isGenerating: false,
      });

      throw error;
    }
  },

  subscribeToJob: (jobId: string) => {
    const eventSource = new EventSource(
      `${API_BASE_URL}/api/generate/${jobId}/stream`
    );

    eventSource.onopen = () => {
      console.log('SSE connection opened for job:', jobId);
    };

    eventSource.addEventListener('progress', (event) => {
      try {
        const currentJob = get().currentJob;
        if (!currentJob) return;

        const messageEvent = event as MessageEvent;
        const data: ProgressEventData = JSON.parse(messageEvent.data);

        // Update the specific result
        const updatedResults = [...currentJob.results];
        updatedResults[data.index] = {
          ...updatedResults[data.index],
          status: data.status,
          url: data.url,
          error: data.error,
        };

        // Update job status if needed
        let jobStatus = currentJob.status;
        if (jobStatus === 'pending') {
          jobStatus = 'running';
        }

        set({
          currentJob: {
            ...currentJob,
            status: jobStatus,
            results: updatedResults,
            startedAt: currentJob.startedAt || new Date().toISOString(),
          },
        });

        console.log(`Image ${data.index} status: ${data.status}`);
      } catch (error) {
        console.error('Error parsing progress event:', error);
      }
    });

    eventSource.addEventListener('done', (event) => {
      try {
        const currentJob = get().currentJob;
        if (!currentJob) return;

        const messageEvent = event as MessageEvent;
        const apiData: DoneEventData = JSON.parse(messageEvent.data);

        const data = {
          status: apiData.status,
          total: apiData.total,
          ttfiMs: apiData.ttfi_ms,
          totalMs: apiData.total_ms,
        };

        set({
          currentJob: {
            ...currentJob,
            status: 'completed',
            completedAt: new Date().toISOString(),
            ttfiMs: data.ttfiMs,
            totalMs: data.totalMs,
          },
          isGenerating: false,
        });

        console.log('Job completed:', {
          total: data.total,
          ttfiMs: data.ttfiMs,
          totalMs: data.totalMs,
        });

        // Close the connection
        eventSource.close();
      } catch (error) {
        console.error('Error parsing done event:', error);
      }
    });

    eventSource.addEventListener('error', (event) => {
      try {
        const messageEvent = event as MessageEvent;
        const apiData: ErrorEventData = JSON.parse(messageEvent.data);

        const data = {
          error: apiData.error,
          jobId: apiData.job_id,
        };

        set({
          error: data.error,
          isGenerating: false,
        });

        console.error('Job error:', data.error);
        eventSource.close();
      } catch (error) {
        console.error('Error parsing error event:', error);
      }
    });

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      set({
        error: 'Connection to server lost',
        isGenerating: false,
      });
      eventSource.close();
    };

    // Store reference to close later
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (get() as any)._eventSource = eventSource;
  },

  unsubscribeFromJob: () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eventSource = (get() as any)._eventSource;

    if (eventSource) {
      eventSource.close();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (get() as any)._eventSource;
      console.log('SSE connection closed');
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearJob: () => {
    // Close any active SSE connection
    get().unsubscribeFromJob();

    set({
      currentJob: null,
      isLoading: false,
      error: null,
      isGenerating: false,
    });
  },
}));
