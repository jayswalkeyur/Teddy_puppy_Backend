import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import {
  AuthenticationError,
  AuthorizationError,
} from "../common/errors/AppError";
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: "admin" | "manager"; email: string };
    }
  }
}
export const authenticate: RequestHandler = (req, _res, next) => {
  try {
    const h = req.headers.authorization;
    if (!h?.startsWith("Bearer ")) throw new AuthenticationError();
    const p = jwt.verify(h.slice(7), env.jwtSecret) as any;
    if (!p.sub || !p.role) throw new AuthenticationError();
    req.user = { id: p.sub, role: p.role, email: p.email };
    next();
  } catch (e) {
    next(
      e instanceof AuthenticationError
        ? e
        : new AuthenticationError("Invalid or expired access token"),
    );
  }
};
export const authorize =
  (...roles: Array<"admin" | "manager">): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) return next(new AuthenticationError());
    if (!roles.includes(req.user.role)) return next(new AuthorizationError());
    next();
  };
