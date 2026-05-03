import type { Persistence } from '@firebase/auth';

/**
 * @firebase/auth publishes root typings that omit RN-only helpers; Metro still
 * resolves the RN implementation. This merge keeps TypeScript aligned with runtime.
 */
declare module '@firebase/auth' {
  export function getReactNativePersistence(
    storage: import('@react-native-async-storage/async-storage').default,
  ): Persistence;
}
