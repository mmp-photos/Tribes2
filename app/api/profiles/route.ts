import { NextResponse } from "next/server";
import connectUsers from "@/app/lib/database/connectUsers";
import { ProfileModel } from "@/app/lib/database/models/ProfileSchema";
import mongoose from "mongoose"; // Import mongoose

export async function GET(
  request: Request,
  { params }: { params: { profileId: string } }
) {
  const { profileId } = params;

  try {
    await connectUsers();

    // Convert profileId to ObjectId
    const objectId = new mongoose.Types.ObjectId(profileId);

    const profile = await ProfileModel.findById(objectId);

    if (!profile) {
      console.log(`No profile found with ID objectId`)
      return NextResponse.json({ message: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.log(`Profile found with ID ${profileId}`)
    console.error("Error fetching profile:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}