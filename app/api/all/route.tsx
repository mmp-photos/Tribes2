import mongoose from "mongoose";
import { NextResponse } from 'next/server';
import connectUsers from "@/app/lib/database/connectUsers";
import { UserModel as User } from "@/app/lib/database/models/UserSchema"; // Import the named export

interface CreateUserInput {
    email: string;
    password: string;
    accountStatus: string;
    accountType: string;
    dateCreated: Date;
    lastLogin: Date;
    lastLogout: Date;
    termsAccepted: object;
    termsAcceptedOn: Date;
    profile: object
}

const MONGODB_DB = process.env.ATLAS_DB ?? "";
const MONGODB_COLLECTION = process.env.ATLAS_COLLECTION ?? "";

export async function POST(req: Request) {
    try {
        await connectUsers(); // Ensure database connection

        const body = await req.json(); // ✅ Read request body only once

        const userInput: CreateUserInput = {
            email: body.user?.email ?? "", // Required field, ensure it's a string
            password: body.user?.password ?? "", // Required field, ensure it's a string
            accountStatus: body.user?.accountStatus ?? "pending", // Default to "pending"
            accountType: body.user?.accountType ?? "standard", // Default to "standard"
            dateCreated: body.user?.dateCreated ? new Date(body.user.dateCreated) : new Date(),
            lastLogin: body.user?.lastLogin ? new Date(body.user.lastLogin) : new Date(),
            lastLogout: body.user?.lastLogout ? new Date(body.user.lastLogout) : new Date(),
            termsAccepted: body.user?.termsAccepted ?? {}, // Default to empty object
            termsAcceptedOn: body.user?.termsAcceptedOn ? new Date(body.user.termsAcceptedOn) : new Date(),
            profile: body.user?.profile ?? {}, // Default to empty object
        };
        const searchString = userInput.email
        console.log(userInput.email)

        try {
            let allUsers;
            if(userInput.email){
                allUsers = await User.find({ email: searchString }).exec(); // Use the Mongoose model
            }
            else {
                allUsers = await User.find().exec(); // Use the Mongoose model
            }
            return NextResponse.json(allUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    } catch (error) {
        console.log(`Error connecting: Error Message - ${error}`);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}