import { Router } from "express";
import * as c from "./puppy.controller";
import { validate } from "../../middleware/validate";
import {
  listValidation,
  slugValidation,
  idValidation,
  createValidation,
  updateValidation,
} from "./puppy.validation";
import { authenticate, authorize } from "../../middleware/auth";
const pub = Router(),
  admin = Router();
pub.get("/", validate(listValidation), c.list);
pub.get("/featured", c.featured);
pub.get("/search", validate(listValidation), c.list);
pub.get("/:slug", validate(slugValidation), c.bySlug);
admin.use(authenticate, authorize("admin", "manager"));
admin.get("/", validate(listValidation), c.list);
admin.get("/:id", validate(idValidation), c.adminById);
admin.post("/", validate(createValidation), c.create);
admin.patch("/:id", validate(updateValidation), c.update);
admin.delete("/:id", validate(idValidation), c.remove);
export { pub as publicPuppyRoutes, admin as adminPuppyRoutes };
