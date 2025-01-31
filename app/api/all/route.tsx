import mongoose from "mongoose";
import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/app/lib/databasae/connectToDatabase";

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

const MONGODB_URI = process.env.ATLAS_URI ?? "";
const MONGODB_DB = process.env.ATLAS_DB ?? "";
const MONGODB_COLLECTION = process.env.ATLAS_COLLECTION ?? "";

export async function POST(req: Request) {

    const body = await req.json();

    // Map to CreateUserInput type //
    const userInput: CreateUserInput = {
        email: body.user.email,
        password: body.user.password,
        accountStatus: body.user.accountStatus || "pending", // Default if missing
        accountType: body.user.accountType || "standard", // Default if missing
        dateCreated: body.user.dateCreated ? new Date(body.user.dateCreated) : new Date(),
        lastLogin: body.user.lastLogin ? new Date(body.user.lastLogin) : new Date(),
        lastLogout: body.user.lastLogout ? new Date(body.user.lastLogout) : new Date(),
        termsAccepted: body.user.termsAccepted || {},
        termsAcceptedOn: body.user.termsAcceptedOn ? new Date(body.user.termsAcceptedOn) : new Date(),
        profile: body.user.profile || {},
    };

    try {
        // FETCH DATA FROM THE DATABASE
        const client = await connectToDatabase();
        if (!client) {
            throw new Error('Failed to connect to MongoDB');
        }
        console.log('Connected to the users database');
        const db = client.db(MONGODB_DB);
        const collection = db.collection(MONGODB_COLLECTION);

        const allUsers = await collection.find().toArray();
    
        return NextResponse.json(allUsers);
        
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}