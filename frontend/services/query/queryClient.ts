import { QueryClient } from '@tanstack/react-query';

import { ApiError } from '@/api/types';

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= 2) return false;
  if (error instanceof ApiError) {
    return error.status >= 500;
  }
  return true;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: shouldRetry,
    },
    mutations: {
      retry: 0,
    },
  },
});
