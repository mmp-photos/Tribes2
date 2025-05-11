import { NextRequest, NextResponse } from "next/server";
import connectUsers from "../../lib/database/connectUsers";
import { VibeModel } from "@/app/lib/database/models/VibeSchema";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
    
    try {
        await connectUsers(); // Ensure database connection
        const { PhotoModel } = await import("@/app/lib/database/models/PhotoSchema");

        const idFromQuery = req.nextUrl.searchParams.get('id');

        console.log("Full request URL:", req.url);
        console.log("Parsed URL:", URL);
        console.log("idFromQuery:", idFromQuery);

        let vibe;
        const findCondition = { status: "ok" }; // Define the condition to find only status: "ok"

        if (idFromQuery) {
            // If an id is provided, fetch that specific vibe with status "ok"
            console.log(`Returning vibe with id: ${idFromQuery} and status: "ok"`);
            try {
                if (mongoose.Types.ObjectId.isValid(idFromQuery)) {
                    vibe = await VibeModel.findOne({ _id: idFromQuery, ...findCondition })
                    if (!vibe) {
                        return NextResponse.json({ error: "Vibe not found or status is not 'ok'" }, { status: 404 });
                    }
                    console.log(`Found this vibe in the database ${vibe}`);
                    return NextResponse.json({ success: true, vibe: vibe }); // Return the single object directly
                } else {
                    return NextResponse.json({ error: "Invalid vibe ID" }, { status: 400 });
                }
            } catch (e: any) {
                console.error("Error fetching vibe by ID", e);
                return NextResponse.json({ error: "Error fetching vibe", details: e.message }, { status: 500 });
            }
        } else {
            console.log(`Returning all vibes with status: "ok".`);
            vibe = await VibeModel.find(findCondition);
            return NextResponse.json({ success: true, vibe: vibe });
        }
    } catch (error: any) {
        console.error("Error fetching vibes:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
};

export async function POST(request: Request) {
    await connectUsers(); // Ensure database connection
    const data = await request.json();
    console.log(`The update request has started.`)
    if (!data._id) {
        const newVibe = await VibeModel.create({ ...data, status: "ok" });
        console.log(`New vibe added to database`);
        return NextResponse.json({ vibe: newVibe }, { status: 201 });
    }
    else {
        try {
            const updatedVibe = await VibeModel.findByIdAndUpdate(
                data._id,
                { ...data },
                { new: true, runValidators: true }
            )
            return NextResponse.json({ vibe: "success" }, { status: 200 });
        } catch (error: any) {
            console.error("Error processing request:", error);
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
    }
};