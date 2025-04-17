import { ObjectId } from "mongodb";

export interface DefaultPhoto {
    photoId?: ObjectId;
    caption?: string;
}

export interface Photo {
    _id: string | ObjectId;
    firstName?: string;
    lastName?: string;
    nickName?: string[];
    biography?: string;
    dob?: Date;
    dod?: Date;
    defaultPhoto?: DefaultPhoto;
    additionalPhotos?: Photo[];
    status: string;
    createdBy?: (string | ObjectId)[];
}
