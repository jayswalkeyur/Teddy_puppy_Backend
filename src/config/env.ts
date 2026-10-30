import dotenv from "dotenv";
import Joi from "joi";
dotenv.config();
const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "test", "production")
    .default("development"),
  PORT: Joi.number().port().default(5000),
  MONGODB_URI: Joi.string().required(),
  CLIENT_URL: Joi.string().uri().required(),
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default("15m"),
  BCRYPT_SALT_ROUNDS: Joi.number().integer().min(10).max(14).default(12),
  LOG_LEVEL: Joi.string()
    .valid("fatal", "error", "warn", "info", "debug", "trace", "silent")
    .default("debug"),
  RATE_LIMIT_WINDOW_MS: Joi.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),
  LOGIN_RATE_LIMIT_MAX: Joi.number().default(10),
  ENQUIRY_RATE_LIMIT_MAX: Joi.number().default(5),
  CONTACT_RATE_LIMIT_MAX: Joi.number().default(5),
  TRUST_PROXY: Joi.number().integer().min(0).default(0),
}).unknown(true);
const { value, error } = schema.validate(process.env, {
  abortEarly: false,
  convert: true,
});
if (error)
  throw new Error(`Invalid environment configuration: ${error.message}`);
export const env = {
  nodeEnv: value.NODE_ENV as string,
  port: value.PORT as number,
  mongoUri: value.MONGODB_URI as string,
  clientUrl: value.CLIENT_URL as string,
  jwtSecret: value.JWT_ACCESS_SECRET as string,
  jwtExpires: value.JWT_ACCESS_EXPIRES_IN as string,
  bcryptRounds: value.BCRYPT_SALT_ROUNDS as number,
  logLevel: value.LOG_LEVEL as string,
  rateWindow: value.RATE_LIMIT_WINDOW_MS as number,
  rateMax: value.RATE_LIMIT_MAX_REQUESTS as number,
  loginMax: value.LOGIN_RATE_LIMIT_MAX as number,
  enquiryMax: value.ENQUIRY_RATE_LIMIT_MAX as number,
  contactMax: value.CONTACT_RATE_LIMIT_MAX as number,
  trustProxy: value.TRUST_PROXY as number,
};
