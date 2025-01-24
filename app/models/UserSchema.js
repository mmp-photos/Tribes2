import { Schema, models, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
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
    accountStatus: {
      type: String,
      required: true,
      default: "unconfirmed",
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

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Safeguard against model recompilation
const UserModel = models.User || model("User", userSchema);

export { UserModel };
