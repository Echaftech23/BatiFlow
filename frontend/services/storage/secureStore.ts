import * as SecureStore from 'expo-secure-store';

export const SECURE_KEYS = {
  accessToken: 'batiflow_access_token',
} as const;

export async function getAccessToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(SECURE_KEYS.accessToken);
  } catch {
    return null;
  }
}

export async function setAccessToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(SECURE_KEYS.accessToken, token);
}

export async function clearAccessToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(SECURE_KEYS.accessToken);
  } catch {
    // Ignore missing key or platform-specific errors.
  }
}
