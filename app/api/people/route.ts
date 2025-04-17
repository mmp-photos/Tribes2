import { NextRequest, NextResponse } from "next/server";
import connectUsers from "../../lib/database/connectUsers";
import { PeopleModel } from "@/app/lib/database/models/PeopleSchema";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
    try {
        await connectUsers(); // Ensure database connection

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
                    people = await PeopleModel.findOne({ _id: idFromQuery, ...findCondition });
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
}

export async function POST(request: Request) {
    const data = await request.json();
    if (!data._id) {
        const newPerson = await PeopleModel.create({ ...data, status: "ok" });
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
}


// export async function POST(request: Request) {
//     try {
//         const data = await request.json();

//         if (!data._id) {
//             // Handle create new color logic here if _id is missing
//             // You might want to set the initial status to "ok" here
//             const newColor = await ColorModel.create({ ...data, status: "ok" });
//             return NextResponse.json({ color: newColor }, { status: 201 });
//         } else {
//             // Handle update existing color logic
//             try {
//                 const objectId = new mongoose.Types.ObjectId(data._id);
//                 // When updating, you might want to allow changing the status,
//                 // so we don't enforce status: "ok" in the update query.
//                 const updatedColor = await ColorModel.findByIdAndUpdate(objectId, data, { new: true });

//                 if (!updatedColor) {
//                     return NextResponse.json({ error: "Color not found" }, { status: 404 });
//                 }

//                 return NextResponse.json({ color: updatedColor }, { status: 200 });

//             } catch (bsonError: any) {
//                 console.error("Error updating color (BSONError):", bsonError);
//                 return NextResponse.json({ error: `Invalid ObjectId format: ${bsonError.message}`, valueType: typeof data._id }, { status: 400 });
//             }
//         }

//     } catch (error: any) {
//         console.error("Error processing request:", error);
//         return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//     }
// }

// export async function DELETE(req: NextRequest) {
//     try {
//         await connectUsers();
//         const idToDelete = req.nextUrl.searchParams.get('id');

//         if (!idToDelete) {
//             return NextResponse.json({ error: "Missing color ID for deletion" }, { status: 400, headers: { 'Content-Type': 'application/json' } });
//         }

//         if (!mongoose.Types.ObjectId.isValid(idToDelete)) {
//             return NextResponse.json({ error: "Invalid color ID" }, { status: 400, headers: { 'Content-Type': 'application/json' } });
//         }

//         const deletedColor = await ColorModel.findByIdAndUpdate(
//             idToDelete,
//             { status: "deleted" },
//             { new: true }
//         );

//         if (!deletedColor) {
//             return NextResponse.json({ error: "Color not found" }, { status: 404, headers: { 'Content-Type': 'application/json' } });
//         }

//         return NextResponse.json({ success: true, message: `Color with ID ${idToDelete} marked as deleted.`, headers: { 'Content-Type': 'application/json' } }, { status: 200 });

//     } catch (error: any) {
//         console.error("Error deleting color:", error);
//         return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500, headers: { 'Content-Type': 'application/json' } });
//     }
// }
