import type { PropsWithChildren } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { GlobalErrorState } from '@/components/ui/GlobalErrorState';

export function ErrorBoundaryProvider({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <GlobalErrorState
          message={
            error instanceof Error ? error.message : 'Une erreur inattendue est survenue.'
          }
          onRetry={resetErrorBoundary}
        />
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
