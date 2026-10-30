import { ErrorRequestHandler, RequestHandler } from "express";
import mongoose from "mongoose";
import { AppError } from "../common/errors/AppError";
import { logger } from "../config/logger";
export const notFound: RequestHandler = (req, _res, next) =>
  next(
    new AppError(
      404,
      `Route ${req.method} ${req.path} not found`,
      "ROUTE_NOT_FOUND",
    ),
  );
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  let e =
    err instanceof AppError ? err : new AppError(500, "Internal server error");
  if (err instanceof mongoose.Error.ValidationError)
    e = new AppError(400, "Database validation failed", "VALIDATION_ERROR");
  else if (err instanceof mongoose.Error.CastError)
    e = new AppError(400, "Invalid resource identifier", "INVALID_ID");
  else if ((err as any)?.code === 11000)
    e = new AppError(
      409,
      "A record with this value already exists",
      "DUPLICATE_KEY",
    );
  else if (err?.name === "VersionError")
    e = new AppError(
      409,
      "This record was modified by another request. Reload and retry.",
      "CONCURRENT_MODIFICATION",
    );
  else if (
    err?.name === "JsonWebTokenError" ||
    err?.name === "TokenExpiredError"
  )
    e = new AppError(401, "Invalid or expired token", "UNAUTHENTICATED");
  logger.error(
    { err, statusCode: e.statusCode, requestId: req.id },
    "Request failed",
  );
  res
    .status(e.statusCode)
    .json({
      success: false,
      message: e.message,
      errorCode: e.errorCode,
      requestId: req.id,
      ...(e.details ? { errors: e.details } : {}),
      ...(process.env.NODE_ENV === "development" && !(err instanceof AppError)
        ? { debug: err.message }
        : {}),
    });
};
