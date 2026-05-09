import { z } from "zod";

import {
  OTP_REGEX,
  passwordStrengthField,
  phoneField,
  zipField,
} from "@/shared/schemas/fieldSchemas";

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
  code: z.string().regex(OTP_REGEX),
});

export const resendVerificationSchema = z.object({
  email: z.string().email(),
});

export const registerRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  profile: z.object({
    name: z.string().min(3),
    profession: z.string().min(3),
    phone: phoneField,
    zone: z.string(),
    address: z.string(),
    city: z.string(),
    zip: zipField,
  }),
});

export const forgotPasswordRequestSchema = z.object({
  email: z.string().email(),
});

export const verifyPasswordResetRequestSchema = z.object({
  email: z.string().email(),
  code: z.string().length(4).regex(/^\d{4}$/),
});

export const resetPasswordRequestSchema = z.object({
  email: z.string().email(),
  code: z.string().length(4),
  password: passwordStrengthField,
});

export type AuthSession = z.infer<typeof authSessionSchema>;
