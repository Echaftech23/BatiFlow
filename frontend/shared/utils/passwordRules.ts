/** Matches BatiFlow/core auth.constants (server validation). */
export const PASSWORD_STRENGTH_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,128}$/;

export const PASSWORD_STRENGTH_MESSAGE_FR =
  '8–128 caractères, avec majuscule, minuscule, chiffre et caractère spécial.';
