import mongoose from "mongoose";
import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/app/lib/databasae/connectToDatabase";
import { UserModel } from "../../models/UserSchema";
import { findByUser } from "@/app/lib/users/findByEmail";

interface CreateUserInput {
    email: string;
    password: string;
}

const MONGODB_URI = process.env.ATLAS_URI;

export async function POST(req: Request) {

    const searchString = {
        email: 'beard@afcrichmond.com',
        password: 'password'
    };
    
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
        // const allUsers = await collection.find({username: body.username}).toArray();
        const allUsers = await collection.find({email: body.email}).toArray();
        // const existingUser = await findByUser(searchString);
        // console.log(`Existing user returned: ${existingUser}`);
    
        console.log(allUsers);
        return NextResponse.json(allUsers);
        
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}