import { QueryClientProvider, useIsFetching, useIsMutating } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { View } from 'react-native';

import { queryClient } from '@/services/query/queryClient';

function QueryActivityOverlay() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const visible = isFetching + isMutating > 0;

  if (!visible) return null;
  return (
    <View className="absolute left-0 right-0 top-0 h-1 bg-primary/80" />
  );
}

export function QueryProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <QueryActivityOverlay />
    </QueryClientProvider>
  );
}
