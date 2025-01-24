import { Schema, models, model } from "mongoose";
import bcrypt from "bcrypt";

const styleSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    accountType: {
      type: String,
      required: true,
      default: "tribesman",
    },
    dateCreated: {
      type: Date,
      required: true,
    },
    lastLogin: {
      type: Date,
    },
    lastLogout: {
      type: Date,
    },
    termsAccepted: {
      type: { type: MyObjectId, ref: 'Terms' },
    },
    termsAcceptedOn: {
      type: Date,
    },
    profile: {
      type: { type: MyObjectId, ref: 'Terms' },
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true, // Set to true for consistency
    },
  }
);

// Safeguard against model recompilation
const StyleModel = models.Style || model("style", styleSchema);

export { StyleModel };
