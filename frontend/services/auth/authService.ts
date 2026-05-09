import axiosInstance from '@/api/axios.config';
import { resolveApiUrl } from '@/services/config/env';
import {
  authSessionSchema,
  forgotPasswordRequestSchema,
  loginRequestSchema,
  registerRequestSchema,
  resendVerificationSchema,
  resetPasswordRequestSchema,
  verifyPasswordResetRequestSchema,
  verifyEmailSchema,
  type AuthSession,
} from '@/shared/schemas/authSchemas';

export async function login(email: string, password: string): Promise<AuthSession> {
  const payload = loginRequestSchema.parse({ email, password });
  const { data } = await axiosInstance.post(resolveApiUrl('/auth/login'), payload, {
    headers: { 'x-public-request': 'true' },
  });
  return authSessionSchema.parse(data);
}

export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  const payload = forgotPasswordRequestSchema.parse({ email });
  const { data } = await axiosInstance.post(resolveApiUrl('/auth/forgot-password'), payload, {
    headers: { 'x-public-request': 'true' },
  });
  return data as { message: string };
}

export async function verifyPasswordResetCode(
  email: string,
  code: string,
): Promise<void> {
  const payload = verifyPasswordResetRequestSchema.parse({ email, code });
  await axiosInstance.post(resolveApiUrl('/auth/verify-password-reset'), payload, {
    headers: { 'x-public-request': 'true' },
  });
}

export async function resetPasswordWithCode(
  email: string,
  code: string,
  password: string,
): Promise<void> {
  const payload = resetPasswordRequestSchema.parse({ email, code, password });
  await axiosInstance.post(resolveApiUrl('/auth/reset-password'), payload, {
    headers: { 'x-public-request': 'true' },
  });
}

export async function register(body: unknown): Promise<{ message?: string }> {
  const payload = registerRequestSchema.parse(body);
  const { data } = await axiosInstance.post(resolveApiUrl('/auth/register'), payload, {
    headers: { 'x-public-request': 'true' },
  });
  return data as { message?: string };
}

export async function verifyEmail(email: string, code: string): Promise<AuthSession> {
  const payload = verifyEmailSchema.parse({ email, code });
  const { data } = await axiosInstance.post(resolveApiUrl('/auth/verify-email'), payload, {
    headers: { 'x-public-request': 'true' },
  });
  return authSessionSchema.parse(data);
}

export async function resendVerification(email: string): Promise<{ message?: string }> {
  const payload = resendVerificationSchema.parse({ email });
  const { data } = await axiosInstance.post(resolveApiUrl('/auth/resend-verification'), payload, {
    headers: { 'x-public-request': 'true' },
  });
  return data as { message?: string };
}
