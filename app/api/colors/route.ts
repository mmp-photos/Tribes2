import { NextRequest, NextResponse } from "next/server";
import connectUsers from "../../lib/database/connectUsers"
import { ColorModel } from "@/app/lib/database/models/ColorSchema";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
    try {
        await connectUsers(); // Ensure database connection
        
        const { searchParams } = new URL(req.url);
        const ids = searchParams.getAll("ids");
        console.log(`the content of ids is: ${ids} and it has a length of ${ids.length}`)

        // if (!ids || ids.length === 0) {
        //     return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
        // }

        // Ensure all IDs are valid MongoDB ObjectId
        const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));
        let colors;

        console.log(validIds);

        if (validIds.length === 0) {
            console.log(`All Colors returned.`)
            colors = await ColorModel.find();
        }
        else {
            console.log(`Specific colors returned`)
            colors = await ColorModel.find({ _id: { $in: validIds } });
        }

        // const allColors = await ColorModel.find(); // Fetch all colors
        // console.log(allColors);
        // const colors = await ColorModel.find({ _id: { $in: validIds } });
        console.log(`The value of colors is: ${colors}`);
        return NextResponse.json({ success: true, colors: colors });
    } catch (error) {
        console.error("Error fetching colors:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {

    //     // Check if color already exists
    //     const existingColor = await ColorModel.findOne({ colorName });
    //     console.log(`The existing color is ${existingColor}`);
    //     if (existingColor) {
    //         console.log(`Existing Color found and an error is being returned`)
    //         console.log(`The color ${colorName} already exists.`);
    //         return NextResponse.json(
    //             { error: `The color ${colorName} already exists in the database.`}, 
    //             { status: 409 }
    //         );
    //     }

    //     // Create and save the new color
    //     const newColor = new ColorModel({
    //         colorName, 
    //         colorValue, 
    //         colorDescription, 
    //         colorFamily, 
    //         complimentaryColors,
    //         contrastingColors,
    //         status
    //     });
    //     if (!existingColor) {
    //         console.log(`No existing color was found.  No error is being returned.`)
    //         await newColor.save();
    //     }

    try {
        const allColors = await ColorModel.find();
        console.log(allColors);

        return NextResponse.json({ success: true, colors: allColors});

    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
