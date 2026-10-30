import { Router } from "express";
import auth from "../modules/auth/auth.routes";
import {
  publicPuppyRoutes,
  adminPuppyRoutes,
} from "../modules/puppies/puppy.routes";
import {
  publicEnquiryRoutes,
  adminEnquiryRoutes,
} from "../modules/enquiries/enquiry.routes";
import {
  publicContactRoutes,
  adminContactRoutes,
} from "../modules/contact/contact.routes";
import { ok } from "../common/utils/response";
import mongoose from "mongoose";
const r = Router();
r.get("/health", (_req, res) =>
  ok(res, {
    status: "ok",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptimeSeconds: Math.floor(process.uptime()),
  }),
);
r.use("/auth", auth);
r.use("/puppies", publicPuppyRoutes);
r.use("/enquiries", publicEnquiryRoutes);
r.use("/contact", publicContactRoutes);
r.use("/admin/puppies", adminPuppyRoutes);
r.use("/admin/enquiries", adminEnquiryRoutes);
r.use("/admin/contact-messages", adminContactRoutes);
export default r;
