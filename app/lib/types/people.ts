import { ObjectId } from "mongodb";
import { Photo } from "./photo";
import { Reaction } from "./reaction";
import { Comment } from "./comment";

export interface DefaultPhoto {
    photoId?: ObjectId;
    caption?: string;
}

export interface People {
    _id: string | ObjectId;
    firstName?: string;
    lastName?: string;
    nickName?: string[];
    biography?: string;
    dob?: Date;
    dod?: Date;
    icon: Boolean;
    defaultPhoto?: DefaultPhoto;
    additionalPhotos?: Photo[];
    connections: People[];
    reactions: Reaction[];
    comments: Comment[];
    status: string;
    createdBy?: (string | ObjectId)[];
}

export type PersonId = string | ObjectId;