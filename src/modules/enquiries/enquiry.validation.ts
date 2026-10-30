import Joi from "joi";
const phone = Joi.string()
  .trim()
  .pattern(/^\+?[0-9][0-9\s().-]{6,22}$/)
  .max(25)
  .required();
const fields = {
  name: Joi.string().trim().min(2).max(80).required(),
  phone,
  email: Joi.string().email().max(254).lowercase().allow(""),
  area: Joi.string().trim().max(80).allow(""),
  message: Joi.string().trim().max(2000).allow(""),
  website: Joi.string().max(200).allow(""),
};
export const createValidation = {
  body: Joi.object({
    ...fields,
    puppyId: Joi.string()
      .guid({ version: ["uuidv4", "uuidv5"] })
      .required(),
  }).unknown(false),
};
export const listValidation = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    status: Joi.string().valid("new", "contacted", "qualified", "closed"),
    puppyId: Joi.string().hex().length(24),
    sort: Joi.string().valid("createdAt").default("createdAt"),
    order: Joi.string().valid("asc", "desc").default("desc"),
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
    status: Joi.string()
      .valid("new", "contacted", "qualified", "closed")
      .required(),
  }).unknown(false),
};
