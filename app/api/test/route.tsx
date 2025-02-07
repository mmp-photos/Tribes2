import { NextRequest, NextResponse } from "next/server";
import { connectUsers } from "@/app/lib/database/connectUsers";
import mongoose, { Schema, model, models } from "mongoose";
import { UserModel } from "@/app/lib/database/models/UserSchema";
import { TermsModel } from "@/app/lib/database/models/TermsSchema";
import { ProfileModel } from "@/app/lib/database/models/ProfileSchema";

export async function POST(req: NextRequest) {
    try {
        await connectUsers(); // Ensure MongoDB is connected
        const body = await req.json();
        const { email, password } = body; // No need to pass termsAccepted

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
        }

        // Check if an active Terms document exists
        const activeTerms = await TermsModel.findOne({ status: 'active' });
        console.log(`Active Terms id is ${activeTerms?._id}`);
        if (!activeTerms) {
            return NextResponse.json({ error: "No active terms found." }, { status: 404 });
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        console.log(existingUser);
        if (existingUser) {
            console.log(`User with email ${email} already exists.`);
            return NextResponse.json(
                { error: "User with that email address already exists." }, 
                { status: 409 }
            );
        }

        // Create and save the new user with the active Terms ID
        const newUser = new UserModel({
            email,
            password, // Ensure it's hashed in the schema middleware
            termsAccepted: activeTerms,
            termsAcceptedOn: new Date(),
        });

        await newUser.save();

        const newProfile = new ProfileModel({
            firstName: 'Rizzo',
            lastName: 'the Rat',
            user: newUser._id, // Use _id to reference the user
        });
        await newProfile.save();

        newUser.profile = newProfile._id;
        await newUser.save();
        
        const allUsers = await UserModel.find();
        console.log(allUsers);

        return NextResponse.json({ success: true, users: allUsers});

    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
