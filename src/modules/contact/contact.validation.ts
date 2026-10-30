import Joi from "joi";
export const createValidation = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(80).required(),
    phone: Joi.string()
      .trim()
      .pattern(/^\+?[0-9][0-9\s().-]{6,22}$/)
      .max(25)
      .required(),
    email: Joi.string().email().max(254).lowercase().allow(""),
    area: Joi.string().trim().max(80).allow(""),
    puppyId: Joi.string()
      .guid({ version: ["uuidv4", "uuidv5"] })
      .allow(""),
    message: Joi.string().trim().max(2000).allow(""),
    website: Joi.string().max(200).allow(""),
  }).unknown(false),
};
export const listValidation = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    status: Joi.string().valid("new", "contacted", "closed"),
  }).unknown(false),
};
export const idValidation = {
  params: Joi.object({ id: Joi.string().hex().length(24).required() }).unknown(
    false,
  ),
};
export const updateValidation = {
  params: idValidation.params,
  body: Joi.object({
    status: Joi.string().valid("new", "contacted", "closed").required(),
  }).unknown(false),
};
