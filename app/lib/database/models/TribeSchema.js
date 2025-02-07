import { Schema, models, model } from "mongoose";

const tribeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    
    attitude: [{ type: String }]
    ,
    vibe: {
      type: String,
      required: false,
    },
    colorFamily: {
      type: String,
      required: false,
    },
    colors: [
      {
        color_id: {
          type: Schema.Types.ObjectId, 
          color: "Colors", // Reference to the Photos collection
        },
      },
    ],
    tops: [
      {
        type: Schema.Types.ObjectId, // Array of ObjectId references
        ref: "Clothing", // Reference to the Clothing collection
      },
    ],
    bottoms: [
      {
        type: Schema.Types.ObjectId, // Array of ObjectId references
        ref: "Clothing", // Reference to the Clothing collection
      },
    ],
    headwear: [
      {
        type: Schema.Types.ObjectId, // Array of ObjectId references
        ref: "Clothing", // Reference to the Clothing collection
      },
    ],
    footwear: [
      {
        type: Schema.Types.ObjectId, // Array of ObjectId references
        ref: "Clothing", // Reference to the Clothing collection
      },
    ],
    outerwear: [
      {
        type: Schema.Types.ObjectId, // Array of ObjectId references
        ref: "Clothing", // Reference to the Clothing collection
      },
    ],
    outerwear: [
      {
        type: Schema.Types.ObjectId, // Array of ObjectId references
        ref: "Clothing", // Reference to the Clothing collection
      },
    ],
    accessories: [
      {
        type: Schema.Types.ObjectId, // Array of ObjectId references
        ref: "Clothing", // Reference to the Clothing collection
      },
    ],
    photos: [
      {
        photo_id: {
          type: Schema.Types.ObjectId, // ObjectId reference to the Photos collection
          ref: "Photos", // Reference to the Photos collection
        },
        caption: {
          type: String, // Caption as a string
        },
      },
    ],
    tribesmen: [
      {
        person_id: {
          type: Schema.Types.ObjectId, // ObjectId reference to the Photos collection
          ref: "Photos", // Reference to the Photos collection
        },
        caption: {
          type: String, // Caption as a string
        },
      },
    ],
    elders: [
      {
        person_id: {
          type: Schema.Types.ObjectId, // ObjectId reference to the Photos collection
          ref: "Photos", // Reference to the Photos collection
        },
        caption: {
          type: String, // Caption as a string
        },
      },
    ],
    createdBy: {
      type: { type: MyObjectId, ref: 'Users' },
    },
    updatedBy: [
      {
        type: { type: MyObjectId, ref: 'Users' },
        updatedAt: Date
      }
    ],
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true, // Set to true for consistency
    },
  }
);

// Safeguard against model recompilation
const TribeModel = models.Style || model("tribe", tribeSchema);

export { TribeModel };
