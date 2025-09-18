import { GENERIC_ERROR_MESSAGE, LOGIN_ERROR_MSG_BY_STATUS } from '@/constants/error';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

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
        const errorMsg = LOGIN_ERROR_MSG_BY_STATUS[
          response.status as keyof typeof LOGIN_ERROR_MSG_BY_STATUS
        ] || GENERIC_ERROR_MESSAGE;
        throw new Error(errorMsg);
      }
  
      return response.json();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : GENERIC_ERROR_MESSAGE);
    }
  }

  async get<T>(endpoint: string, token?: string): Promise<T> {
    const headers: HeadersInit = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        await response.json();
        const errorMsg = LOGIN_ERROR_MSG_BY_STATUS[
          response.status as keyof typeof LOGIN_ERROR_MSG_BY_STATUS
        ] || GENERIC_ERROR_MESSAGE;
        throw new Error(errorMsg);
      }
  
      return response.json();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : GENERIC_ERROR_MESSAGE);
    }
  }
}

// Export a global instance (singleton) of the API client
export const apiClient = new ApiClient();
