import mongoose, { Schema, model, models } from "mongoose";
import AdditionalPhotoSchema from './additionalPhotos.js'; // Adjust the import path as needed

const peopleSchema = new Schema(
  {
    firstName: {
      type: String,
      required: false,
      trim: true,
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
    },
    nickName:
      [{ type: String}]
    ,
    biography:
      { type: String}
    ,
    dob:
      { type: Date}
    ,
    dod:
      { type: Date}
    ,
    icon: {
      type: Boolean,
      default: false
    },
    icon: {
      type: Boolean,
      default: false
    },
    defaultPhoto:
      { caption: {type: String}, photoId: {type: mongoose.Schema.Types.ObjectId, ref: "Photo" }}
    ,
    additionalPhotos: [AdditionalPhotoSchema]
    ,
    connections:
      [{connectionType: {type: String}, connection:{ type: mongoose.Schema.Types.ObjectId, ref: "People" }}]
    ,
    reactions:
      [{reactionType: {type: mongoose.Schema.Types.ObjectId, ref: "Reaction"}, reactionPerson: { type: mongoose.Schema.Types.ObjectId, ref: "People"}}]
    ,
    comments:
      [{ type: mongoose.Schema.Types.ObjectId, ref: "PeopleComment"}]
    ,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
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

// Safeguard against model recompilation
const PeopleModel = models.People || model("People", peopleSchema);

export { PeopleModel };
