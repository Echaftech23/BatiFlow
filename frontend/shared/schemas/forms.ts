import { z } from "zod";

import {
  emailField,
  otpField,
  passwordStrengthField,
  phoneField,
  resetCodeField,
  zipField,
} from "@/shared/schemas/fieldSchemas";

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Mot de passe requis"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerIdentitySchema = z.object({
  name: z.string().nonempty("Nom requis").min(3, "Nom minimum 3 caractères"),
  profession: z.string().nonempty("Métier / spécialité requis").min(3, "Métier / spécialité minimum 3 caractères"),
  phone: phoneField,
  zone: z.string().nonempty("Zone d'intervention requise").min(3, "Zone d'intervention minimum 3 caractères"),
  address: z.string().nonempty("Adresse requise").min(3, "Adresse minimum 3 caractères"),
  zip: zipField,
  city: z.string().nonempty("Ville requise").min(3, "Ville minimum 3 caractères"),
  email: emailField,
  password: passwordStrengthField,
});

export type RegisterIdentityFormValues = z.infer<typeof registerIdentitySchema>;

export const otpSchema = z.object({
  code: otpField,
});

export type OtpFormValues = z.infer<typeof otpSchema>;

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const forgotPasswordCodeModalSchema = z.object({
  code: resetCodeField,
});

export type ForgotPasswordCodeModalValues = z.infer<
  typeof forgotPasswordCodeModalSchema
>;

export const resetPasswordSchema = z
  .object({
    password: passwordStrengthField,
    confirmPassword: z.string().min(1, "Confirmation requise"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const resetPasswordWithCodeSchema = z
  .object({
    code: resetCodeField,
    password: passwordStrengthField,
    confirmPassword: z.string().min(1, "Confirmation requise"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type ResetPasswordWithCodeFormValues = z.infer<typeof resetPasswordWithCodeSchema>;

export const bookingClientSchema = z.object({
  name: z.string().nonempty("Nom requis").min(3, "Nom minimum 3 caractères"),
  email: emailField,
  phone: phoneField,
  address: z.string().nonempty("Adresse requise").min(3, "Adresse minimum 3 caractères"),
  zip: zipField,
  city: z.string().nonempty("Ville requise").min(3, "Ville minimum 3 caractères"),
  serviceLabel: z.string().nonempty("Motif requis").min(3, "Motif minimum 3 caractères"),
});

export type BookingClientFormValues = z.infer<typeof bookingClientSchema>;
