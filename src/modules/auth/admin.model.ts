import { Schema, model } from "mongoose";
const schema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["admin", "manager"],
      default: "admin",
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export const Admin = model("Admin", schema);
