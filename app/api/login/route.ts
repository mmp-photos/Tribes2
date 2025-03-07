import { NextRequest, NextResponse } from "next/server";
import { connectUsers } from "@/app/lib/database/connectUsers";
import mongoose, { Schema, model, models } from "mongoose";
import { UserModel } from "@/app/lib/database/models/UserSchema";
import { serialize } from "cookie";  // Import cookie serializer
import  { Login } from "@/app/lib/users/authenticateUser";
const jwt = require("jsonwebtoken")
const USER_ACCESS: string = process.env.ACCESS_TOKEN_SECRET ?? "";

export async function POST(req: NextRequest) {
    try {
        await connectUsers(); // Ensure MongoDB is connected
        const body = await req.json();
        const { email, password } = body; // No need to pass termsAccepted
        const loginStatus = await Login(email, password);
        console.log(`The login status is ${loginStatus}`);

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
        }

        // const signedInUser = await UserModel.findOne({ email }); 
        const user ={name: "email"};
        const accessToken = jwt.sign(user, USER_ACCESS);

        const response = NextResponse.json({ success: true });
        response.headers.set(
            "Set-Cookie",
            serialize("access_token", accessToken, {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 3600, // 1 hour expiration
            })
        );

        return response;
        // return NextResponse.json({accessToken: accessToken, success: true,});

    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
