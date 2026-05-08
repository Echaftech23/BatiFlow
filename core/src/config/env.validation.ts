import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  MONGODB_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().min(16).required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  OTP_PEPPER: Joi.string().min(16).required(),
  OTP_TTL_MINUTES: Joi.number().integer().min(1).max(60).default(15),
  OTP_MAX_SENDS_PER_HOUR: Joi.number().integer().min(1).max(100).default(5),
  OTP_MAX_ATTEMPTS: Joi.number().integer().min(1).max(20).default(5),
  PASSWORD_RESET_TTL_MINUTES: Joi.number().integer().min(5).max(1440).default(60),
  PASSWORD_RESET_MAX_SENDS_PER_HOUR: Joi.number().integer().min(1).max(100).default(5),
  PASSWORD_RESET_LINK_BASE: Joi.string()
    .allow('')
    .default('batiflow://reset-password'),
  RESEND_API_KEY: Joi.string().allow('').optional(),
  RESEND_FROM_EMAIL: Joi.string().allow('').optional(),
  FIREBASE_PROJECT_ID: Joi.string().allow('').optional(),
  FIREBASE_CLIENT_EMAIL: Joi.string().allow('').optional(),
  FIREBASE_PRIVATE_KEY: Joi.string().allow('').optional(),
}).custom((value: Record<string, unknown>, helpers) => {
  const key =
    typeof value['RESEND_API_KEY'] === 'string'
      ? value['RESEND_API_KEY'].trim()
      : '';
  const from =
    typeof value['RESEND_FROM_EMAIL'] === 'string'
      ? value['RESEND_FROM_EMAIL'].trim()
      : '';
  if (key.length > 0 && from.length === 0) {
    return helpers.message({
      custom: '"RESEND_FROM_EMAIL" is required when RESEND_API_KEY is set',
    });
  }
  if (from.length > 0) {
    const { error } = Joi.string().email().validate(from);
    if (error) {
      return helpers.message({
        custom: '"RESEND_FROM_EMAIL" must be a valid email',
      });
    }
  }
  return value;
});
