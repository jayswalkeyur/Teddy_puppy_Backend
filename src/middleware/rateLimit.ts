import rateLimit from "express-rate-limit";
import { env } from "../config/env";
const make = (max: number) =>
  rateLimit({
    windowMs: env.rateWindow,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests. Please try again later.",
      errorCode: "RATE_LIMITED",
    },
  });
export const generalLimiter = make(env.rateMax),
  loginLimiter = make(env.loginMax),
  enquiryLimiter = make(env.enquiryMax),
  contactLimiter = make(env.contactMax);
