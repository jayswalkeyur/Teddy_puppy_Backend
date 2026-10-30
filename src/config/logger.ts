import pino from "pino";
import { env } from "./env";
export const logger = pino({
  level: env.logLevel as
    | "fatal"
    | "error"
    | "warn"
    | "info"
    | "debug"
    | "trace"
    | "silent",
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "req.body.password",
      "req.body.token",
      "*.password",
      "*.token",
    ],
    censor: "[REDACTED]",
  },
  ...(env.nodeEnv === "development"
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        },
      }
    : {}),
});
