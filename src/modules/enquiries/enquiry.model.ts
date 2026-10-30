import { Schema, model } from "mongoose";
const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    phone: { type: String, required: true, trim: true, maxlength: 25 },
    email: { type: String, lowercase: true, trim: true, maxlength: 254 },
    area: { type: String, trim: true, maxlength: 80 },
    puppy: {
      type: Schema.Types.ObjectId,
      ref: "Puppy",
      required: true,
      index: true,
    },
    puppyPublicId: { type: String, required: true },
    puppyName: { type: String, required: true },
    puppySlug: { type: String, required: true },
    message: { type: String, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "closed"],
      default: "new",
      index: true,
    },
    source: { type: String, default: "puppy-profile" },
  },
  { timestamps: true, strict: "throw" },
);
schema.index({ status: 1, createdAt: -1 });
schema.index({ createdAt: -1 });
export const Enquiry = model("Enquiry", schema);
