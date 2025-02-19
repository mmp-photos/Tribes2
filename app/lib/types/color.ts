import { ObjectId } from "mongodb"; // Import ObjectId from MongoDB types

export interface Color {
    _id: string | ObjectId;  // Allow both string and ObjectId
    colorName: string;
    colorValue: string;
}

export type ColorId = string | ObjectId;