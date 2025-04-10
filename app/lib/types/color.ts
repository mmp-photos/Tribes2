import { ObjectId } from "mongodb";

export interface Color {
    _id: string | ObjectId;  // Ensure _id is always required
    colorName: string;
    colorValue: string;
    colorDescription?: string; // Optional
    colorFamily?: ObjectId[]; // Optional
    complementaryColors?: Color[]; // Expecting an array of Color objects after population
    contrastingColors?: Color[];   // Expecting an array of Color objects after population
    status?: string; // Optional
    createdBy?: (string | ObjectId)[];
}

export interface RelatedColor {
    _id: string | ObjectId;  // Ensure _id is always required
    colorName: string;
    colorValue: string;
}

export type ColorId = string | ObjectId;