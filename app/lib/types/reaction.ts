import { ObjectId } from "mongodb";

export interface Reaction {
    _id: string | ObjectId;
    reactionType: ObjectId;
    reactionPeople: ObjectId;
    createdBy?: (string | ObjectId)[];
}
