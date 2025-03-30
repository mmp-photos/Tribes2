import { ObjectId } from "mongodb";

export interface Color {
    _id: string | ObjectId;  // Ensure _id is always required
    colorName: string;
    colorValue: string;
    colorDescription?: string; // Optional
    colorFamily?: ObjectId[]; // Optional
    complementaryColors?: (string | ObjectId)[]; // Accept both strings and ObjectIds
    contrastingColors?: (string | ObjectId)[]; // Accept both strings and ObjectIds
    status?: string; // Optional
    createdBy?: (string | ObjectId)[];
}

export interface RelatedColor {
    _id: string | ObjectId;  // Ensure _id is always required
    colorName: string;
    colorValue: string;
}

export type ColorId = string | ObjectId;