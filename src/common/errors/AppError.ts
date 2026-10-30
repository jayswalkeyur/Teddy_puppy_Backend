export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errorCode = "INTERNAL_ERROR",
    public details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}
export class ValidationError extends AppError {
  constructor(message = "Validation failed", details?: unknown) {
    super(400, message, "VALIDATION_ERROR", details);
  }
}
export class AuthenticationError extends AppError {
  constructor(message = "Invalid credentials") {
    super(401, message, "UNAUTHENTICATED");
  }
}
export class AuthorizationError extends AppError {
  constructor(message = "You are not authorized") {
    super(403, message, "FORBIDDEN");
  }
}
export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(404, message, "NOT_FOUND");
  }
}
export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(409, message, "CONFLICT");
  }
}
