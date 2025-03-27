import mongoose, { Schema, model, models } from "mongoose";

const colorSchema = new Schema(
  {
    colorName: {
      type: String,
      required: true,
      trim: true,
    },
    colorValue: {
      type: String,
      required: true,
      trim: true,
    },
    colorDescription: {
      type: String,
    },
    colorFamily:
        [{ type: mongoose.Schema.Types.ObjectId, ref: "ColorFamily" }]
    ,
    complimentaryColors:
        [{ type: mongoose.Schema.Types.ObjectId, ref: "Color" }]
    ,
    contrastingColors:
        [{ type: mongoose.Schema.Types.ObjectId, ref: "Color" }]
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
const ColorModel = models.Color || model("Color", colorSchema);

export { ColorModel };
