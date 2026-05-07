import { z } from 'zod';

import {
  PASSWORD_STRENGTH_MESSAGE_FR,
  PASSWORD_STRENGTH_REGEX,
} from '@/shared/utils/passwordRules';

export const loginSchema = z.object({
  email: z.string().min(1, 'E-mail requis').email('E-mail invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerIdentitySchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  trade: z.string().min(1, 'Métier / spécialité requis'),
  phone: z.string().min(1, 'Téléphone requis'),
  zone: z.string().min(1, "Zone d'intervention requise"),
  address: z.string().min(1, 'Adresse requise'),
  zip: z
    .string()
    .min(1, 'Code postal requis')
    .regex(/^\d{5}$/, 'Code postal à 5 chiffres'),
  city: z.string().min(1, 'Ville requise'),
  email: z.string().min(1, 'E-mail requis').email('E-mail invalide'),
  password: z
    .string()
    .regex(PASSWORD_STRENGTH_REGEX, PASSWORD_STRENGTH_MESSAGE_FR),
});

export type RegisterIdentityFormValues = z.infer<typeof registerIdentitySchema>;

export const otpSchema = z.object({
  code: z
    .string()
    .length(6, 'Code à 6 chiffres')
    .regex(/^\d{6}$/, 'Chiffres uniquement'),
});

export type OtpFormValues = z.infer<typeof otpSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'E-mail requis').email('E-mail invalide'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .regex(PASSWORD_STRENGTH_REGEX, PASSWORD_STRENGTH_MESSAGE_FR),
    confirmPassword: z.string().min(1, 'Confirmation requise'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const bookingClientSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  phone: z.string().min(1, 'Téléphone requis'),
  email: z.string().min(1, 'E-mail requis').email('E-mail invalide'),
  serviceLabel: z.string().optional(),
});

export type BookingClientFormValues = z.infer<typeof bookingClientSchema>;
