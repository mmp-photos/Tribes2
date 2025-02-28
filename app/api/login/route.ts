import { NextRequest, NextResponse } from "next/server";
import { connectUsers } from "@/app/lib/database/connectUsers";
import mongoose, { Schema, model, models } from "mongoose";
import { UserModel } from "@/app/lib/database/models/UserSchema";
import  login from "@/app/lib/users/authenticateUser";

export async function POST(req: NextRequest) {
    try {
        await connectUsers(); // Ensure MongoDB is connected
        const body = await req.json();
        const { email, password } = body; // No need to pass termsAccepted
        const loginStatus = await login(email, password);
        console.log(`The login status is ${loginStatus}`);

        // // Validate required fields
        // if (!email || !password) {
        //     return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
        // }

        // const signedInUser = await UserModel.findOne({ email });
        return NextResponse.json({ success: true, users: loginStatus});

    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
