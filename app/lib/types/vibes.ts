import { ObjectId } from "mongodb"; // Import ObjectId from MongoDB types
import { DefaultPhoto } from "./photo";

export interface Vibes {
    _id: string | ObjectId;  // Make _id optional
    vibe?: string;
    description?: string;
    defaultPhoto?: DefaultPhoto;
    status: string;
    createdBy?: (string | ObjectId);
}

export type VibeId = string | ObjectId;