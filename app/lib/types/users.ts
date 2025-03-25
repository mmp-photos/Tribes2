import { ObjectId } from "mongodb"; // Import ObjectId from MongoDB types

export interface User {
    _id?: string | ObjectId;  // Make _id optional
    email: string;
    password: string;
    profileId: string | ObjectId;  // Make _id optional;
}
  
export interface ReturnedUser {
    _id?: string | ObjectId;  // Make _id optional
    accountStatus: string;
    accountType: string;
    createdAt: Date;
    email: string;
    password: string;
    dob: Date;
    termsAccepted: string,
    termsAcceptedOn: Date;
    updatedAt: Date;
    profileId: string | ObjectId;  // Make _id optional;
}

