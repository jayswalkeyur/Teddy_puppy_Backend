import Joi from "joi";
export const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().max(254).required(),
    password: Joi.string().min(1).max(128).required(),
  }).required(),
};
