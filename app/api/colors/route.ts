import { NextRequest, NextResponse } from "next/server";
import connectUsers from "../../lib/database/connectUsers";
import { ColorModel } from "@/app/lib/database/models/ColorSchema";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
    try {
        await connectUsers(); // Ensure database connection

        const idFromQuery = req.nextUrl.searchParams.get('id');

        console.log("Full request URL:", req.url);
        console.log("Parsed URL:", URL);
        console.log("idFromQuery:", idFromQuery);

        let colors;
        const findCondition = { status: "ok" }; // Define the condition to find only status: "ok"

        if (idFromQuery) {
            // If an id is provided, fetch that specific color with status "ok"
            console.log(`Returning color with id: ${idFromQuery} and status: "ok"`);
            try {
                if (mongoose.Types.ObjectId.isValid(idFromQuery)) {
                    colors = await ColorModel.findOne({ _id: idFromQuery, ...findCondition }) // Added findCondition
                        .populate({
                            path: 'complementaryColors',
                            select: '_id colorName colorValue',
                            strictPopulate: false
                        })
                        .populate({
                            path: 'contrastingColors',
                            select: '_id colorName colorValue',
                            strictPopulate: false
                        })
                        .exec();
                    if (!colors) {
                        return NextResponse.json({ error: "Color not found or status is not 'ok'" }, { status: 404 });
                    }
                    colors = [colors];
                    console.log(colors);
                    return NextResponse.json({ success: true, colors: colors });
                } else {
                    return NextResponse.json({ error: "Invalid color ID" }, { status: 400 });
                }
            } catch (e: any) {
                console.error("Error fetching color by ID", e);
                return NextResponse.json({ error: "Error fetching color", details: e.message }, { status: 500 });
            }
        } else {
            // Otherwise, fetch all colors with status "ok"
            console.log(`Returning all colors with status: "ok".`);
            colors = await ColorModel.find(findCondition) // Added findCondition
                .populate({
                    path: 'complementaryColors',
                    select: '_id colorName colorValue',
                    strictPopulate: false
                })
                .populate({
                    path: 'contrastingColors',
                    select: '_id colorName colorValue',
                    strictPopulate: false
                })
                .exec();
            return NextResponse.json({ success: true, colors: colors });
        }
    } catch (error: any) {
        console.error("Error fetching colors:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        if (!data._id) {
            // Handle create new color logic here if _id is missing
            // You might want to set the initial status to "ok" here
            const newColor = await ColorModel.create({ ...data, status: "ok" });
            return NextResponse.json({ color: newColor }, { status: 201 });
        } else {
            // Handle update existing color logic
            try {
                const objectId = new mongoose.Types.ObjectId(data._id);
                // When updating, you might want to allow changing the status,
                // so we don't enforce status: "ok" in the update query.
                const updatedColor = await ColorModel.findByIdAndUpdate(objectId, data, { new: true });

                if (!updatedColor) {
                    return NextResponse.json({ error: "Color not found" }, { status: 404 });
                }

                return NextResponse.json({ color: updatedColor }, { status: 200 });

            } catch (bsonError: any) {
                console.error("Error updating color (BSONError):", bsonError);
                return NextResponse.json({ error: `Invalid ObjectId format: ${bsonError.message}`, valueType: typeof data._id }, { status: 400 });
            }
        }

    } catch (error: any) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}