import { z } from 'zod';

export const authSessionSchema = z.object({
  accessToken: z.string().min(1),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    emailVerified: z.boolean(),
  }),
});

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const verifyEmailSchema = z.object({
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/),
});

export const resendVerificationSchema = z.object({
  email: z.string().email(),
});

export const registerRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  profile: z
    .object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      trade: z.string().optional(),
      phone: z.string().optional(),
      zone: z.string().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      zip: z.string().optional(),
    })
    .optional(),
});

export type AuthSession = z.infer<typeof authSessionSchema>;
