import { RequestHandler } from "express";
import Joi from "joi";
import { ValidationError } from "../common/errors/AppError";
export const validate =
  (schema: {
    body?: Joi.ObjectSchema;
    query?: Joi.ObjectSchema;
    params?: Joi.ObjectSchema;
  }): RequestHandler =>
  (req, res, next) => {
    const errors: any[] = [];
    for (const key of ["body", "query", "params"] as const) {
      if (!schema[key]) continue;
      const { error, value } = schema[key]!.validate(req[key], {
        abortEarly: false,
        convert: true,
        stripUnknown: false,
      });
      if (error)
        errors.push(
          ...error.details.map((d) => ({
            field: d.path.join("."),
            message: d.message.replace(/"/g, "'"),
          })),
        );
      else
        Object.defineProperty(req, key, {
          value,
          configurable: true,
          writable: true,
          enumerable: true,
        });
    }
    if (errors.length)
      return next(new ValidationError("Validation failed", errors));
    next();
  };
