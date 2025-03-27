import { NextResponse } from "next/server";
import connectUsers from "@/app/lib/database/connectUsers";
import { UserModel } from "@/app/lib/database/models/UserSchema"; // Import your User model
import { ProfileModel } from "@/app/lib/database/models/ProfileSchema"; // Import your Profile model
import { decodeJWT } from "@/app/lib/users/decodeJWT"; // Import your decodeJWT function

export async function GET(request: Request) {
  try {
    await connectUsers();

    const token = request.headers.get("authorization")?.split(" ")[1]; // Get token from header

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = decodeJWT(token);

    if (!decoded || !decoded.user || !decoded.user._id) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.user._id;

    // Fetch user and populate the profile
    const user = await UserModel.findById(userId).populate("profile");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user with profile:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}