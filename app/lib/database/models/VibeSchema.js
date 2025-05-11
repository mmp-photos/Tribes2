import { Schema, models, model } from "mongoose";
import AdditionalPhotoSchema from './additionalPhotos.js'; // Adjust the import path as needed

const vibeSchema = new Schema(
  {
    vibe: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    defaultPhoto:
      { caption: {type: String}, altText: {type: String}, photoId: {type: Schema.Types.ObjectId, ref: "Photo" }}
    ,
    reactions:
      [{reactionType: {type: Schema.Types.ObjectId, ref: "Reaction"}, reactionPerson: { type: Schema.Types.ObjectId, ref: "People"}}]
    ,
    comments:
      [{ type: Schema.Types.ObjectId, ref: "PeopleComment"}]
    ,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    status:{
      type: String,
      required: true,
      default: "ok",
    }
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

const VibeModel = models.Vibe || model("Vibe", vibeSchema);

export { VibeModel };
