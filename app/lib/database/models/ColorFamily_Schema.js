import mongoose, { Schema, model, models } from "mongoose";

const colorFamilySchema = new Schema(
  {
    familyName: {
      type: String,
      required: true,
      trim: true,
    },
    familyDescription: {
      type: String,
    },
    colors:
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
const ColorFamilyModel = models.ColorFamily || model("ColorFamily", colorSchema);

export { ColorFamily };
