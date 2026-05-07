import axiosInstance from '@/api/axios.config';
import {
  authSessionSchema,
  loginRequestSchema,
  registerRequestSchema,
  resendVerificationSchema,
  verifyEmailSchema,
  type AuthSession,
} from '@/shared/schemas/authSchemas';

export async function login(email: string, password: string): Promise<AuthSession> {
  const payload = loginRequestSchema.parse({ email, password });
  const { data } = await axiosInstance.post('/auth/login', payload, {
    headers: { 'x-public-request': 'true' },
  });
  return authSessionSchema.parse(data);
}

export async function register(body: unknown): Promise<{ message?: string }> {
  const payload = registerRequestSchema.parse(body);
  const { data } = await axiosInstance.post('/auth/register', payload, {
    headers: { 'x-public-request': 'true' },
  });
  return data as { message?: string };
}

export async function verifyEmail(email: string, code: string): Promise<AuthSession> {
  const payload = verifyEmailSchema.parse({ email, code });
  const { data } = await axiosInstance.post('/auth/verify-email', payload, {
    headers: { 'x-public-request': 'true' },
  });
  return authSessionSchema.parse(data);
}

export async function resendVerification(email: string): Promise<{ message?: string }> {
  const payload = resendVerificationSchema.parse({ email });
  const { data } = await axiosInstance.post('/auth/resend-verification', payload, {
    headers: { 'x-public-request': 'true' },
  });
  return data as { message?: string };
}
