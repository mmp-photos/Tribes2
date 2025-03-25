import { ObjectId } from "mongodb"; // Import ObjectId from MongoDB types
  
export interface Profile {
    _id?: string | ObjectId;  // Make _id optional
    createdAt: Date;
    name: string;
    screnName: string;
    icon: string;
    bio: string;
    termsAccepted: string,
    termsAcceptedOn: Date;
    updatedAt: Date;
    profileId: string | ObjectId;  // Make _id optional;
}

