import type { ApiResponse } from '../../shared/types';

const API_BASE = '/api';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

async function request<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, headers, body, ...rest } = options;

  const url = `${API_BASE}${endpoint}${params ? buildQueryString(params) : ''}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  };

  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    config.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, config);
    const data = (await res.json()) as ApiResponse<T>;

    if (!data.success) {
      throw new Error(data.message || data.error || '请求失败');
    }

    return data.data as T;
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err);
    throw err;
  }
}

export const http = {
  get: <T>(endpoint: string, params?: FetchOptions['params']) =>
    request<T>(endpoint, { method: 'GET', params }),

  post: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'POST', body }),

  patch: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'PATCH', body }),

  put: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'PUT', body }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};

export default http;
