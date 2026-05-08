import type { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorBoundaryProvider } from '@/providers/ErrorBoundaryProvider';
import { QueryProvider } from '@/providers/QueryProvider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <ErrorBoundaryProvider>
        <QueryProvider>{children}</QueryProvider>
      </ErrorBoundaryProvider>
    </SafeAreaProvider>
  );
}
