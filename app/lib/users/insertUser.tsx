import { UserModel } from "../../models/UserSchema";
import { NextResponse } from 'next/server';
import { connectToDatabase } from "../databasae/connectToDatabase";

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

export async function findByUser(userInput: CreateUserInput) {
    try {
        // Check if a user with the same email already exists
        const existingUser = await UserModel.findOne({ email: userInput.email });
        console.log(existingUser);
        if (existingUser) {
            return true;
        }
        else{
            return `No user was found`;
        }

    } catch (error) {
        console.error("Error inserting user:", error);
        if (error instanceof Error) {
            console.error("Error inserting user:", error.message);
            return { success: false, error: error.message };
        } else {
            console.error("Unknown error occurred:", error);
            return { success: false, error: "An unknown error occurred" };
        }
    }
}

export async function insertUserOld(userInput: CreateUserInput) {
        
    try {
        // Check if a user with the same email already exists
        const existingUser = await UserModel.findOne({ email: userInput.email });
        if (existingUser) {
            return NextResponse.json(existingUser)
            throw new Error("A user with this email already exists.");
        }

        // Create a new user instance
        const newUser = new UserModel(userInput);

        // Save the user to the database
        const savedUser = await newUser.save();

        return { success: true, data: savedUser };
    } catch (error) {
        console.error("Error inserting user:", error);
        if (error instanceof Error) {
            console.error("Error inserting user:", error.message);
            return { success: false, error: error.message };
        } else {
            console.error("Unknown error occurred:", error);
            return { success: false, error: "An unknown error occurred" };
        }
    }
}
