import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { randomUUID } from "crypto";
import routes from "./routes";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { generalLimiter } from "./middleware/rateLimit";
import { notFound, errorHandler } from "./middleware/errors";
export const app = express();
app.disable("x-powered-by");
if (env.trustProxy > 0) app.set("trust proxy", env.trustProxy);
app.use(
  pinoHttp({
    logger,
    genReqId: () => randomUUID(),
    customLogLevel(_req, res, err) {
      if (err || res.statusCode >= 500) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
    customSuccessMessage(req, res) {
      return `${req.method} ${req.url} ${res.statusCode}`;
    },
    customErrorMessage(req, res, err) {
      return `${req.method} ${req.url} ${res.statusCode} ${err.message}`;
    },
    customProps(req) {
      return { requestId: req.id };
    },
  }),
);
app.use(helmet());
app.use(
  cors({
    origin: (origin, cb) => {
      if (
        !origin ||
        origin === env.clientUrl ||
        (env.nodeEnv === "development" &&
          /^http:\/\/localhost:\d+$/.test(origin))
      )
        return cb(null, true);
      return cb(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  }),
);
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "30kb" }));
app.use(cookieParser());
app.use(hpp());
app.use(compression());
app.use("/api/v1", generalLimiter, routes);
app.use(notFound);
app.use(errorHandler);
