import { Schema, model } from "mongoose";
const imageSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, trim: true, maxlength: 200 },
    isPrimary: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false },
);
const schema = new Schema(
  {
    publicId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    breed: { type: String, required: true, trim: true, index: true },
    gender: {
      type: String,
      enum: ["male", "female", "mixed", "unknown"],
      default: "unknown",
    },
    age: {
      value: Number,
      unit: { type: String, enum: ["days", "weeks", "months", "years"] },
    },
    status: {
      type: String,
      enum: ["available", "reserved", "sold", "unavailable"],
      default: "available",
      index: true,
    },
    location: { type: String, default: "Dubai, United Arab Emirates" },
    origin: String,
    description: String,
    images: { type: [imageSchema], default: [] },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true, index: true },
    publishedAt: Date,
    deletedAt: Date,
  },
  { timestamps: true, strict: "throw", optimisticConcurrency: true },
);
schema.index({ isPublished: 1, status: 1, createdAt: -1 });
schema.index({ breed: 1, isPublished: 1, status: 1 });
schema.index({ isFeatured: 1, isPublished: 1 });
schema.index(
  { name: "text", breed: "text", description: "text" },
  { weights: { name: 5, breed: 4, description: 1 }, name: "puppy_text_search" },
);
export const Puppy = model("Puppy", schema);
