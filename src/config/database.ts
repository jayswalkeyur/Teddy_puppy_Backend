import mongoose from "mongoose";
import { logger } from "./logger";
import { env } from "./env";
export async function connectDatabase() {
  mongoose.set("sanitizeFilter", true);
  await mongoose.connect(env.mongoUri);
  logger.info("MongoDB connected");
  mongoose.connection.on("disconnected", () =>
    logger.warn("MongoDB disconnected"),
  );
  mongoose.connection.on("error", (e) =>
    logger.error({ err: e }, "MongoDB connection error"),
  );
}
