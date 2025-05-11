import { ObjectId } from "mongodb";

export interface Photo {
    _id: string | ObjectId;
    firstName?: string;
    lastName?: string;
    nickName?: string[];
    biography?: string;
    dob?: Date;
    dod?: Date;
    defaultPhoto?: DefaultPhoto;
    additionalPhotos?: {
        photoId: {
            _id: string;
            fileName: string;
            url?: string;
            creditName?: string;
            creditUrl?: string;
            defaultCaption?: string;
        };
        caption?: string;
    }[];
    status: string;
    createdBy?: (string | ObjectId)[];
}

export interface AdditionalPhotoItemProps {
    photoId: {
        _id: string;
        fileName: string;
        creditName?: string;
        creditUrl?: string;
        defaultCaption?: string;
        altText?: string;
    },
    caption?: string;
}

export interface AdditionalPhotosListProps { // Corrected interface for the list component
    additionalPhotos?: {
        photoId: {
            _id: string;
            fileName: string;
            url?: string;
            creditName?: string;
            creditUrl?: string;
            defaultCaption?: string;
        };
        caption?: string;
    }[];
}

export interface DefaultPhoto {
    photoId?: ObjectId;
    caption?: string;
    altText?: string;
}

export interface PhotoId {
    photoId: string;
}