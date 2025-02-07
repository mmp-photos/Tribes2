import mongoose, { Schema, model, models } from "mongoose";

const profileSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
    },
    profileStatus: {
      type: String,
      required: true,
      default: "incomplete",
    },
    accountType: {
      type: String,
      required: true,
      default: "tribesman",
    },
    dateCreated: {
      type: Date,
      required: true,
      default: Date.now,
    },
    displayName: {
      type: String,
    },
    photo: {
        type: String,
    },
    connections: 
        [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
    ,
    tribes:
        [{ type: mongoose.Schema.Types.ObjectId, ref: "Tribe" }]
    ,
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

// Safeguard against model recompilation
const ProfileModel = models.Profile || model("Profile", profileSchema);

export { ProfileModel };
