import { app } from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";
import { logger } from "./config/logger";
async function bootstrap() {
  await connectDatabase();
  const server = app.listen(env.port, () =>
    logger.info(
      { port: env.port, environment: env.nodeEnv },
      "TeddyPups API started",
    ),
  );
  const shutdown = (signal: string) => {
    logger.info({ signal }, "Shutting down");
    server.close(() => {
      void import("mongoose")
        .then((m) => m.default.disconnect())
        .finally(() => process.exit(0));
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}
process.on("unhandledRejection", (reason) => {
  logger.fatal({ err: reason }, "Unhandled promise rejection");
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Uncaught exception");
  process.exit(1);
});
bootstrap().catch((err) => {
  logger.fatal({ err }, "Application startup failed");
  process.exit(1);
});
