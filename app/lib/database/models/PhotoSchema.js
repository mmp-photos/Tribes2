import mongoose, { Schema, model, models } from "mongoose";

const photoSchema = new Schema(
  {
    fileName: {
      type: String,
      required: false,
      trim: true,
    },
    category: {
      type: String,
      required: false,
      trim: true,  
    },
    defaultCaption: {
      type: String,
      required: false,
      trim: true,
    },
    date:
      { type: Date}
    ,
    copyrightType:
      { type: String}
    ,
    creditName:
      { type: String}
    ,
    creditUrl:
      { type: String}
    ,
    sourceUrl:{
      type: String,
      required: true,
    },
    uploadedBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    modifiedBy:[
        {
          profileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
          },
          date: {
            type: Date,
            default: Date.now
          }
        }
    ],
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
const PhotoModel = models.Photo || model("Photo", photoSchema);

export { PhotoModel };
