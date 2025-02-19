import { NextRequest, NextResponse } from "next/server";
import { connectUsers } from "@/app/lib/database/connectUsers";
import { ColorModel } from "@/app/lib/database/models/ColorSchema";

export async function POST(req: NextRequest) {
    console.log(`Request has run.`);
    
    try {
        await connectUsers(); // Ensure MongoDB is connected
        const body = await req.json();
        const { 
            colorName, 
            colorValue, 
            // colorDescription, 
            // colorFamily, 
            // complimentaryColors,
            // contrastingColors,
            // status,
          } = body;

        // Create and save the new color
        const newColor = new ColorModel({
            colorName, 
            colorValue, 
            // colorDescription, 
            // colorFamily, 
            // complimentaryColors,
            // contrastingColors,
            // status
        });

        if(!colorName){
            const allColors = await ColorModel.find();
            return NextResponse.json({ success: true, users: allColors});
        }

        // Check if color already exists
        const existingColor = await ColorModel.findOne({ colorName });
        if (existingColor) {
            console.log(`Existing Color found and an error is being returned`)
            console.log(`The color ${colorName} already exists.`);
            return NextResponse.json(
                { error: `The color ${colorName} already exists in the database.`}, 
                { status: 409 }
            );
        }

        if (!existingColor) {
            console.log(`No existing color was found.  No error is being returned.`)
            await newColor.save();
        }

        const allColors = await ColorModel.find();
        console.log(allColors);

        return NextResponse.json({ success: true, users: allColors});

    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
