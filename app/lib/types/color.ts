import { ObjectId } from "mongodb";

export interface Color {
    _id: string | ObjectId;
    colorName: string;
    colorValue: string;
    colorDescription?: string; // Optional
    colorFamily?: ObjectId[]; // Optional
    complementaryColors?: ObjectId[]; // Optional
    contrastingColors?: ObjectId[]; // Optional
    status?: string; // Optional
}

export type ColorId = string | ObjectId;