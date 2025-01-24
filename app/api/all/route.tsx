import mongoose from "mongoose";
import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/app/lib/databasae/connectToDatabase";
import { UserModel } from "../../models/UserSchema";

interface CreateUserInput {
    email: string;
    password: string;
}

const MONGODB_URI = process.env.ATLAS_URI;

export async function POST(req: Request) {

    try {
        if (!mongoose.connection.readyState) {
            console.log("Connecting to MongoDB...");
            await mongoose.connect(process.env.ATLAS_URI!);
            console.log("Mongoose connected to MongoDB.");
          }
        const body = await req.json();

        // FETCH DATA FROM THE DATABASE
        const client = await connectToDatabase();
        if (!client) {
            throw new Error('Failed to connect to MongoDB');
        }
        console.log('Connected to the users database');
        const db = client.db('TribesOfMen');
        const collection = db.collection('users');
        const allUsers = await collection.find({username: body.username}).toArray();

        console.log(allUsers);
        return NextResponse.json(allUsers);






        // Save the user to the database
        const { email, password, accountStatus, accountType, dateCreated, lastLogin, lastLogout, termsAccepted, termsAcceptedOn, profile } = body;

        const newUser = new UserModel({
            email: email,
            password: password,
            accountStatus: accountStatus,
            accountType: accountType,
            dateCreated: body.dateCreated || Date.now(),
            lastLogin: lastLogin,
            lastLogout: lastLogout,
            termsAccepted: termsAccepted,
            termsAcceptedOn: termsAcceptedOn,
            profile: profile
        });

        const savedUser = await newUser.save();

        console.log('New user added:', savedUser);
        return NextResponse.json(savedUser, { status: 201 });
        
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
