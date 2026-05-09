import { PASSWORD_STRENGTH_REGEX } from './passwordRules';

/** Visual fill 0–1 from character-class checks (aligned with server regex). */
export function passwordStrengthRatio(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9\s]/.test(password)) score += 1;
  const ratio = score / 5;
  return PASSWORD_STRENGTH_REGEX.test(password) ? Math.max(ratio, 1) : ratio;
}
