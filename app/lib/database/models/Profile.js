import { Schema, models, model } from "mongoose";
import bcrypt from "bcrypt";

const profileSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    accountStatus: {
      type: String,
      required: true,
      default: "unconfirmed",
    },
    dob: {
      type: Date,
      required: true,
    },
    accountType: {
        type: String,
        required: true,
        default: "unconfirmed",
    },
    lastLogin: {
      type: Date,
    },
    lastLogout: {
      type: Date,
    },
    termsAccepted: {
      type: Schema.Types.ObjectId, // Correct type for ObjectId references
      ref: "Terms", // Reference to the Terms model
    },
    termsAcceptedOn: {
      type: Date,
    },
    profile: {
      type: Schema.Types.ObjectId, // Correct type for ObjectId references
      ref: "Profile", // Reference to the Profile model (if applicable)
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

profileSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Safeguard against model recompilation
const ProfileModel = models.Profile || model("Profile", profileSchema);

export { ProfileModel };
