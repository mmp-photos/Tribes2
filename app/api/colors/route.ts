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
        if (idFromQuery) {
            // If an id is provided, fetch that specific color
            console.log(`Returning color with id: ${idFromQuery}`);
            try {
                if (mongoose.Types.ObjectId.isValid(idFromQuery)) {
                    colors = await ColorModel.findById(idFromQuery)
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
                        return NextResponse.json({ error: "Color not found" }, { status: 404 });
                    }
                    colors = [colors];
                    return NextResponse.json({ success: true, colors: colors });
                } else {
                    return NextResponse.json({ error: "Invalid color ID" }, { status: 400 });
                }
            } catch (e: any) {
                console.error("Error fetching color by ID", e);
                return NextResponse.json({ error: "Error fetching color", details: e.message }, { status: 500 });
            }
        }  else {
            // Otherwise, fetch all colors
            console.log(`Returning all colors.`);
            colors = await ColorModel.find()
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

export async function POST(req: NextRequest) {
    try {
        await connectUsers();
        const data = await req.json();
        console.log(`The POST route ran for api/colors`);
        console.log("Received data:", data);

        if (data._id) {
            //Update existing color
            const objectId = new mongoose.Types.ObjectId(data._id);
            try { // Wrap the update operation in a try-catch
                const updatedColor = await ColorModel.findByIdAndUpdate(objectId, data, { new: true });
                if (!updatedColor) {
                    return NextResponse.json({ error: "Color not found" }, { status: 404 });
                }
                return NextResponse.json({ success: true, message: "Color updated successfully", color: updatedColor });
            } catch (updateError: any) { // Catch errors during the update
                console.error("Error updating color:", updateError);
                return NextResponse.json({ error: "Failed to update color", details: updateError.message }, { status: 500 });
            }


        } else {
            //create new color.
            const newColor = new ColorModel(data);
            try {
                const savedColor = await newColor.save();
                return NextResponse.json({ success: true, message: "Color created successfully", color: savedColor, status: 201 });
            } catch (saveError: any) { // Catch errors during the save
                 console.error("Error saving new color:", saveError);
                return NextResponse.json({ error: "Failed to create color", details: saveError.message }, { status: 500 });
            }
        }


    } catch (error: any) {
        console.error("Error processing color data:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
