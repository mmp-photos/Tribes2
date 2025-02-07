import { Schema, models, model } from "mongoose";

const termsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive"], // Ensure only valid statuses
    },
  },
  {
    timestamps: true, // Simplified, applies to both createdAt & updatedAt
  }
);

// Safeguard against model recompilation
const TermsModel = models.Terms || model("Terms", termsSchema);

export { TermsModel };
