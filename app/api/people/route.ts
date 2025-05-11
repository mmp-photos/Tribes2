import { NextRequest, NextResponse } from "next/server";
import connectUsers from "../../lib/database/connectUsers";
import { PeopleModel } from "@/app/lib/database/models/PeopleSchema";
import AdditionalPhotoSchema from "@/app/lib/database/models/additionalPhotos";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
    
    try {
        await connectUsers(); // Ensure database connection
        const { PhotoModel } = await import("@/app/lib/database/models/PhotoSchema");

        const idFromQuery = req.nextUrl.searchParams.get('id');

        console.log("Full request URL:", req.url);
        console.log("Parsed URL:", URL);
        console.log("idFromQuery:", idFromQuery);

        let people;
        const findCondition = { status: "ok" }; // Define the condition to find only status: "ok"

        if (idFromQuery) {
            // If an id is provided, fetch that specific person with status "ok"
            console.log(`Returning person with id: ${idFromQuery} and status: "ok"`);
            try {
                if (mongoose.Types.ObjectId.isValid(idFromQuery)) {
                    people = await PeopleModel.findOne({ _id: idFromQuery, ...findCondition }).populate('additionalPhotos.photoId').populate('defaultPhoto')
                    if (!people) {
                        return NextResponse.json({ error: "Person not found or status is not 'ok'" }, { status: 404 });
                    }
                    console.log(`Found this person in the database ${people}`);
                    return NextResponse.json({ success: true, person: people }); // Return the single object directly
                } else {
                    return NextResponse.json({ error: "Invalid person ID" }, { status: 400 });
                }
            } catch (e: any) {
                console.error("Error fetching person by ID", e);
                return NextResponse.json({ error: "Error fetching person", details: e.message }, { status: 500 });
            }
        } else {
            console.log(`Returning all people with status: "ok".`);
            people = await PeopleModel.find(findCondition);
            return NextResponse.json({ success: true, person: people });
        }
    } catch (error: any) {
        console.error("Error fetching people:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
};

export async function POST(request: Request) {
    await connectUsers(); // Ensure database connection
    const data = await request.json();
    if (!data._id) {
        const newPerson = await PeopleModel.create({ ...data, status: "ok" });
        console.log(`New person added to database`);
        return NextResponse.json({ color: newPerson }, { status: 201 });
    }
    else {
        try {
            const objectId = new mongoose.Types.ObjectId(data._id);
            return NextResponse.json({ person: "success" }, { status: 200 });
        } catch (error: any) {
            console.error("Error processing request:", error);
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
    }
};