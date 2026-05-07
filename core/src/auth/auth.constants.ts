/** Aligned with product rules: min 8, upper, lower, digit, special. */
export const PASSWORD_STRENGTH_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,128}$/;

export const PASSWORD_STRENGTH_MESSAGE =
  'Password must be 8–128 characters and include uppercase, lowercase, a number, and a special character';
