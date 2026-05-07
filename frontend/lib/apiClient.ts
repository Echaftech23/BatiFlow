import httpClient from '../api/axios.config';
import { ApiError } from '../api/types';

export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: unknown,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

export type ApiRequestInit = RequestInit & { auth?: boolean };

export async function apiFetch(
  path: string,
  init: ApiRequestInit = {},
): Promise<Response> {
  const { auth = true, method = 'GET', body, headers } = init;
  const response = await httpClient.request({
    url: path,
    method,
    data: body,
    headers: {
      ...(headers as Record<string, string>),
      ...(auth ? {} : { 'x-public-request': 'true' }),
    },
    validateStatus: () => true,
  });

  return new Response(JSON.stringify(response.data), {
    status: response.status,
    headers: response.headers as HeadersInit,
  });
}

export async function apiJson<T>(path: string, init: ApiRequestInit = {}): Promise<T> {
  const res = await apiFetch(path, init);
  let body: unknown = {};
  try {
    body = await res.json();
  } catch {
    body = {};
  }
  if (!res.ok) {
    const b = body as { message?: string };
    const msg = typeof b.message === 'string' && b.message.length > 0 ? b.message : `Erreur ${String(res.status)}`;
    const error = new ApiError(msg, res.status, body);
    throw new ApiRequestError(error.message, error.status, error.body);
  }
  return body as T;
}
