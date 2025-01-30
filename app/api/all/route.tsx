import mongoose from "mongoose";
import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/app/lib/databasae/connectToDatabase";
import { UserModel } from "../../models/UserSchema";
import { findByUser } from "@/app/lib/users/insertUser";

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

          // Ensure `user` exists in request body
          if (!body.user) {
              return NextResponse.json({ error: "User data missing in request" }, { status: 400 });
          }
  
          // Map to CreateUserInput type
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
  
          console.log("Mapped user input:", userInput);
  
          // Call findByUser function with mapped userInput
        //   const existingUser = await findByUser(userInput);  

        // FETCH DATA FROM THE DATABASE
        const client = await connectToDatabase();
        if (!client) {
            throw new Error('Failed to connect to MongoDB');
        }
        console.log('Connected to the users database');
        const db = client.db('TribesOfMen');
        const collection = db.collection('users');
        const allUsers = await collection.find().toArray();
    
        // console.log(`***********************************  ${existingUser} ***********************************`);
        return NextResponse.json(allUsers);
        
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}