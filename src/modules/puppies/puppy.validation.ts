import Joi from "joi";
const objectId = Joi.string().hex().length(24);
const query = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(12),
  q: Joi.string().trim().max(100),
  search: Joi.string().trim().max(100),
  breed: Joi.string().trim().max(80),
  gender: Joi.string().valid("male", "female", "mixed", "unknown"),
  status: Joi.string().valid("available", "reserved", "sold", "unavailable"),
  featured: Joi.boolean(),
  sort: Joi.string()
    .valid("createdAt", "name", "breed", "publishedAt")
    .default("createdAt"),
  order: Joi.string().valid("asc", "desc").default("desc"),
}).unknown(false);
const image = Joi.object({
  url: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .required(),
  alt: Joi.string().max(200).allow(""),
  isPrimary: Joi.boolean().default(false),
  sortOrder: Joi.number().integer().min(0).default(0),
});
const body = Joi.object({
  publicId: Joi.string()
    .guid({ version: ["uuidv4", "uuidv5"] })
    .required(),
  name: Joi.string().trim().min(1).max(100).required(),
  slug: Joi.string()
    .lowercase()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(120),
  breed: Joi.string().trim().min(1).max(80).required(),
  gender: Joi.string().valid("male", "female", "mixed", "unknown"),
  age: Joi.object({
    value: Joi.number().min(0).required(),
    unit: Joi.string().valid("days", "weeks", "months", "years").required(),
  }).unknown(false),
  status: Joi.string().valid("available", "reserved", "sold", "unavailable"),
  location: Joi.string().max(120),
  origin: Joi.string().max(120).allow(""),
  description: Joi.string().max(5000).allow(""),
  images: Joi.array().items(image).max(30),
  isFeatured: Joi.boolean(),
  isPublished: Joi.boolean(),
}).unknown(false);
export const listValidation = { query };
export const slugValidation = {
  params: Joi.object({ slug: Joi.string().max(120).required() }).unknown(false),
};
export const idValidation = {
  params: Joi.object({ id: objectId.required() }).unknown(false),
};
export const createValidation = { body };
export const updateValidation = {
  params: Joi.object({ id: objectId.required() }).unknown(false),
  body: body
    .fork(["name", "breed"], (s) => s.optional())
    .fork(["publicId"], (s) => s.forbidden())
    .min(1),
};
