import { ObjectId } from "mongodb";
import { Photo } from "./photo";
import { Person } from "./people";
import { Reaction } from "./reaction";
import type { Comment } from "./comment";

export interface Tribe {
    _id: string | ObjectId;
    photoId?: ObjectId;
    caption?: string;
    name: string;
    description: string;
    attitude?: string[];
    vibe?: string[];
    colorFamily?: string[];
    colors?: string[]
    upperBody: string[];
    lowerBody: string[];
    headwear: string[];
    footwear: string[];
    outerwear: string[];
    underwear: string[];
    accessories: string[];
    photos: Photo[];
    tribesmen: Person[];
    elders: Person[]
    createdBy?: (string | ObjectId)[];
    updatedBy?: (string | ObjectId)[];
};