import { Router } from "express";
import * as c from "./enquiry.controller";
import { validate } from "../../middleware/validate";
import {
  createValidation,
  listValidation,
  idValidation,
  updateValidation,
} from "./enquiry.validation";
import { enquiryLimiter } from "../../middleware/rateLimit";
import { authenticate, authorize } from "../../middleware/auth";
const pub = Router(),
  admin = Router();
pub.post("/", enquiryLimiter, validate(createValidation), c.create);
admin.use(authenticate, authorize("admin", "manager"));
admin.get("/", validate(listValidation), c.list);
admin.get("/:id", validate(idValidation), c.get);
admin.patch("/:id", validate(updateValidation), c.update);
export { pub as publicEnquiryRoutes, admin as adminEnquiryRoutes };
