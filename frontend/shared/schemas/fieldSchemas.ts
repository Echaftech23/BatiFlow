import { z } from "zod";

import {
  PASSWORD_STRENGTH_MESSAGE_FR,
  PASSWORD_STRENGTH_REGEX,
} from "@/shared/utils/passwordRules";

export const OTP_REGEX = /^\d{6}$/;
export const RESET_CODE_REGEX = /^\d{4}$/;
export const ZIP_REGEX = /^\d{5}$/;
export const PHONE_REGEX = /^06\d{8}$/;

export const emailField = z.string().nonempty("E-mail requis").min(3, "E-mail minimum 3 caractères").email("E-mail invalide");

export const passwordStrengthField = z
  .string()
  .nonempty("Mot de passe requis")
  .regex(PASSWORD_STRENGTH_REGEX, PASSWORD_STRENGTH_MESSAGE_FR);

export const zipField = z.string().nonempty("Code postal requis").regex(ZIP_REGEX, "Code postal à 5 chiffres");

export const otpField = z
  .string()
  .nonempty("Code requis")
  .length(6, "Code à 6 chiffres")
  .regex(OTP_REGEX, "Chiffres uniquement");

export const resetCodeField = z
  .string()
  .nonempty("Code requis")
  .length(4, "Code à 4 chiffres")
  .regex(RESET_CODE_REGEX, "Chiffres uniquement");

export const phoneField = z
  .string()
  .nonempty("Numéro de téléphone requis")
  .regex(PHONE_REGEX, "Le numéro doit commencer par 06 et contenir exactement 10 chiffres")
  .length(10, "Le numéro doit contenir exactement 10 chiffres");
