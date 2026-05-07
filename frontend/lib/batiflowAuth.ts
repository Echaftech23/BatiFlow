import { getApiBaseUrl } from '@/services/config/env';

type AuthFirebaseResponse = {
  accessToken: string;
  user: { id: string; email: string; emailVerified: boolean };
};

type ApiErrorBody = {
  statusCode?: number;
  message?: string;
};

export async function exchangeFirebaseIdTokenForJwt(
  idToken: string,
): Promise<AuthFirebaseResponse> {
  const base = getApiBaseUrl();

  const res = await fetch(`${base}/auth/firebase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = {};
  }

  if (!res.ok) {
    const err = body as ApiErrorBody;
    const msg =
      typeof err.message === 'string' && err.message.length > 0
        ? err.message
        : `Request failed (${String(res.status)})`;
    throw new Error(msg);
  }

  return body as AuthFirebaseResponse;
}
