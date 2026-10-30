import { Router } from "express";
import * as c from "./contact.controller";
import { validate } from "../../middleware/validate";
import {
  createValidation,
  listValidation,
  idValidation,
  updateValidation,
} from "./contact.validation";
import { contactLimiter } from "../../middleware/rateLimit";
import { authenticate, authorize } from "../../middleware/auth";
const pub = Router(),
  admin = Router();
pub.post("/", contactLimiter, validate(createValidation), c.create);
admin.use(authenticate, authorize("admin", "manager"));
admin.get("/", validate(listValidation), c.list);
admin.get("/:id", validate(idValidation), c.get);
admin.patch("/:id", validate(updateValidation), c.update);
export { pub as publicContactRoutes, admin as adminContactRoutes };
