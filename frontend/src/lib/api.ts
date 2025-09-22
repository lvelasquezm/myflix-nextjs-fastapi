import { GENERIC_ERROR_MESSAGE } from '@/constants/error';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

/** Custom API error class. */
export class CustomApiError extends Error {
  /** Error status code. */
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'CustomApiError';
    this.statusCode = statusCode;
  }
}

/** API client for making requests to the backend API. */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async post<T>(endpoint: string, data: any, token?: string): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        await response.json();
        throw new CustomApiError(response.statusText, response.status);
      }
  
      return response.json();
    } catch (error) {
      // Re-throw CustomApiError.
      if (error instanceof CustomApiError) {
        throw error;
      }

      const msg = error instanceof Error ? error.message : GENERIC_ERROR_MESSAGE;
      console.error('Failed POST request with error message:', msg);

      throw new Error(msg);
    }
  }
}

// Export a global instance (singleton) of the API client
export const apiClient = new ApiClient();
