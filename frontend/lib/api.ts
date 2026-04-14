const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const API_BASE_URL_FORMS = process.env.NEXT_PUBLIC_API_BASE_URL_FORMS || 'https://waitflow.onrender.com';
const PROJECT_ID = '69c115bb66242e3801a36b50';

import { AuthManager } from './auth';


interface ApiResponse<T = Record<string, unknown>> {
  success: boolean;
  data?: T;
  message?: string;
  status: number;
}

class ApiClient {
  private baseURL: string;
  private formsURL: string;

  constructor(baseURL: string, formsURL: string) {
    this.baseURL = baseURL;
    this.formsURL = formsURL;
  }

  private async base_request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    // Import AuthManager dynamically to avoid circular imports
    const { AuthManager } = await import('@/lib/auth');
    const authHeader = AuthManager.getAuthHeader();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const body = await response.json().catch(() => ({}));
      
      return {
        success: response.ok,
        data: response.ok ? (body.data !== undefined ? body.data : body) : undefined,
        message: body.message || body.error || `Request failed with status ${response.status}`,
        status: response.status,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        status: 0,
      };
    }
  }

  private async forms_request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.formsURL.replace(/\/+$/, '')}${endpoint}`;

    const isNgrokHost = this.formsURL.includes('ngrok');
    const enableNgrokBypass = process.env.NEXT_PUBLIC_ENABLE_NGROK_BYPASS === 'true';

    const authHeader = AuthManager.getAuthHeader();
    const headersInit: Record<string, string> = {
      'Content-Type': 'application/json',
      ...authHeader,
      ...(options.headers as Record<string, string>),
    };

    // Add project ID for admin requests or if specifically requested
    if (endpoint.includes('/admin') || endpoint.includes('/projects/')) {
      headersInit['x-project-id'] = PROJECT_ID;
    }

    if (enableNgrokBypass && isNgrokHost) {
      headersInit['ngrok-skip-browser-warning'] = '1';
    }

    const config: RequestInit = {
      headers: headersInit,
      ...options,
    };

    if (process.env.NODE_ENV === 'development') {
      console.log(`[ApiClient] Requesting: ${options.method || 'GET'} ${url}`);
    }

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get("content-type");
      let body;
      
      if (contentType && contentType.includes("application/json")) {
        body = await response.json().catch(() => ({}));
      } else {
        const text = await response.text().catch(() => "");
        body = { message: text };
      }
      
      return {
        success: response.ok,
        data: response.ok ? (body.data !== undefined ? body.data : body) : undefined,
        message: body?.message || body?.error || `Request failed with status ${response.status}`,
        status: response.status,
      };
    } catch (error) {
      console.error('Forms API request failed:', error);
      return {
        success: false,
        message: 'Network error or CORS issue. Please try again later.',
        status: 0,
      };
    }
  }

  // Public endpoints
  async joinWaitlist(email: string): Promise<ApiResponse> {
    return this.forms_request('/v1/projects/reap/public/waitlist', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async submitContactMessage(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<ApiResponse> {
    return this.forms_request('/v1/projects/reap/public/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Admin endpoints
  async getWaitlistResponses(): Promise<ApiResponse> {
    return this.forms_request('/v1/admin/waitlist/responses');
  }

  async getContactResponses(): Promise<ApiResponse> {
    return this.forms_request('/v1/admin/contact/responses');
  }

  async getDashboardStats(): Promise<ApiResponse> {
    return this.forms_request('/v1/admin/stats');
  }

  async getWaitlistStats(): Promise<ApiResponse> {
    return this.forms_request('/v1/admin/stats/waitlist');
  }

  async getContactStats(): Promise<ApiResponse> {
    return this.forms_request('/v1/admin/stats/contact');
  }

  async updateWaitlistStatus(id: string, status: string): Promise<ApiResponse> {
    return this.forms_request(`/v1/admin/waitlist/responses/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async updateContactStatus(id: string, status: string): Promise<ApiResponse> {
    return this.forms_request(`/v1/admin/contact/responses/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // --- REAP Database Endpoints ---
  async getProperties(): Promise<ApiResponse<any[]>> {
    return this.base_request<any[]>('/v1/public/property');
  }

  async addProperty(data: {
    name: string;
    description: string;
    documentId: string;
    type: string;
    location: string;
    value: number;
    shares: number;
  }): Promise<ApiResponse<any>> {
    return this.base_request<any>('/v1/admin/property', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteProperty(id: string): Promise<ApiResponse> {
    return this.base_request(`/v1/admin/property/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL, API_BASE_URL_FORMS);
export type { ApiResponse };
