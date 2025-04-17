import { ObjectId } from "mongodb";
import { People } from "./people"

export interface Comment {
    _id: string | ObjectId;
    commentOn: ObjectId;
    commentParent: ObjectId;
    commentPeople: People[];
    commentDate: Date;
    createdBy?: (string | ObjectId)[];
}
