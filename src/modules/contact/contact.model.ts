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
    puppy: { type: Schema.Types.ObjectId, ref: "Puppy", default: null },
    puppyPublicId: { type: String, default: null },
    message: { type: String, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true, strict: "throw" },
);
schema.index({ status: 1, createdAt: -1 });
export const ContactMessage = model("ContactMessage", schema);
