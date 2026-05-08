import { Platform } from 'react-native';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getRawApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '');
  }
  if (__DEV__) {
    return 'http://127.0.0.1:3000';
  }
  throw new Error(
    'Missing EXPO_PUBLIC_API_URL. Copy frontend/.env.example to frontend/.env and set your API URL.',
  );
}

function isAndroidEmulatorHost(): boolean {
  if (Platform.OS !== 'android') {
    return false;
  }
  const { Fingerprint = '' } = Platform.constants as {
    Fingerprint?: string;
  };
  const fp = Fingerprint.toLowerCase();
  return (
    fp.includes('generic') ||
    fp.includes('unknown') ||
    fp.includes('emulator') ||
    fp.includes('sdk_gphone') ||
    fp.includes('ranchu') ||
    fp.includes('goldfish')
  );
}

/**
 * Android emulator runs in a VM: localhost/127.0.0.1 is the emulator itself, not the dev machine.
 * Map those hosts to 10.0.2.2 so requests reach Nest on the host.
 * Physical devices keep the URL (use LAN IP, or `adb reverse tcp:3000 tcp:3000` with 127.0.0.1).
 */
function normalizeApiBaseUrlForDevice(url: string): string {
  if (!isAndroidEmulatorHost()) {
    return url;
  }
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    if (host === 'localhost' || host === '127.0.0.1') {
      parsed.hostname = '10.0.2.2';
    }
    let out = parsed.toString();
    if (out.endsWith('/')) {
      out = out.slice(0, -1);
    }
    return out;
  } catch {
    return url;
  }
}

export function getApiBaseUrl(): string {
  return normalizeApiBaseUrlForDevice(getRawApiBaseUrl());
}

/** Absolute URL — avoids relative `/auth/...` calls hitting the Expo web dev server (Cannot POST). */
export function resolveApiUrl(path: string): string {
  const base = getApiBaseUrl().replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

export function getFirebaseConfig() {
  return {
    apiKey: requireEnv('EXPO_PUBLIC_FIREBASE_API_KEY'),
    authDomain: requireEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
    projectId: requireEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
    storageBucket: requireEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: requireEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
    appId: requireEnv('EXPO_PUBLIC_FIREBASE_APP_ID'),
  };
}

export function getGoogleSignInConfig() {
  return {
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  };
}
