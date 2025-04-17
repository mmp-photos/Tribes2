import mongoose, { Schema, model, models } from "mongoose";

const peopleCommentSchema = new Schema(
  {
    commentOn:
      [{ type: mongoose.Schema.Types.ObjectId, ref: "People"}]
    ,
    commentParent:
      [{ type: mongoose.Schema.Types.ObjectId, ref: "PeopleComment"}]
    ,
    commentPeople:
      [{ type: mongoose.Schema.Types.ObjectId, ref: "People"}]
    ,
    commentDate:
      { type: Date}
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

// Safeguard against model recompilation
const PeopleCommentModel = models.PeopleComment || model("PeopleComment", peopleCommentSchema);

export { PeopleCommentModel };
