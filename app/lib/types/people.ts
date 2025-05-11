import { ObjectId } from "mongodb";
import { Photo } from "./photo";
import { Reaction } from "./reaction";
import type { Comment } from "./comment";

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
    fictional: Boolean;
    defaultPhoto?: DefaultPhoto;
    additionalPhotos?: { 
        _id: false,
        photoId: { // Each object has a photoId property which is an object
            _id: string;
            fileName: string;
            url?: string;
            creditName?: string;
            creditUrl?: string;
            defaultCaption?: string;
        };
        caption?: string; // Each object also has a caption property
    }[];
    connections: People[];
    reactions: Reaction[];
    comments: Comment[];
    status: string;
    createdBy?: (string | ObjectId)[];
}

export interface PersonName {
    _id: string | ObjectId;
    firstName?: string;
    lastName?: string;
    nickName?: string[];
    status: string;
}

export type PersonId = string | ObjectId;