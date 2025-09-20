export type GenerationStatus =
  | 'pending'
  | 'running'
  | 'succeeded'
  | 'failed'
  | 'completed';

export interface GenerationRequest {
  prompt: string;
  numImages: number;
}

export interface GenerationResponse {
  job_id: string;
}

export interface GenerationResult {
  index: number;
  status: GenerationStatus;
  url?: string;
  error?: string;
  startedAt?: string;
  finishedAt?: string;
}

export interface GenerationJob {
  jobId: string;
  prompt: string;
  numImages: number;
  status: GenerationStatus;
  results: GenerationResult[];
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  ttfiMs?: number;
  totalMs?: number;
}

export interface GenerationJobResponse {
  jobId: string;
}

// Server-Sent Events types
export interface ProgressEventData {
  index: number;
  status: GenerationStatus;
  url?: string;
  error?: string;
}

export interface DoneEventData {
  status: 'done';
  total: number;
  ttfi_ms?: number;
  total_ms?: number;
}

export interface ErrorEventData {
  error: string;
  job_id: string;
}

export interface GenerationState {
  currentJob: GenerationJob | null;
  isLoading: boolean;
  error: string | null;
  isGenerating: boolean;
}

export interface GenerationActions {
  createJob: (request: GenerationRequest) => Promise<string>;
  subscribeToJob: (jobId: string) => void;
  unsubscribeFromJob: () => void;
  clearError: () => void;
  clearJob: () => void;
}
