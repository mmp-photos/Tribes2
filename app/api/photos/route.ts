// app/api/photos/route.ts

import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { PhotoModel } from "@/app/lib/database/models/PhotoSchema";
import { PeopleModel } from "@/app/lib/database/models/PeopleSchema";
import mongoose from 'mongoose';
import connectUsers from "../../lib/database/connectUsers";

// Configure the directory to save uploaded images
const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');

// Helper function to ensure the upload directory exists
async function ensureDirectoryExists(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err: any) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
}

export const config = {
  api: {
    bodyParser: false, // Important to disable default parsing for FormData
  },
};

export async function POST(req: NextRequest) {
  try {
    await ensureDirectoryExists(uploadDir);
    const formData = await req.formData();
    const photoFile = formData.get('photo') as File | null; // Be explicit about possible null
    const category = formData.get('category') as string | null;
    const sourceUrl = formData.get('sourceUrl') as string | null;
    const referenceString = formData.get('reference') as string | null;
    const copyrightType = formData.get('copyrightType') as string | null;
    const creditName = formData.get('creditName') as string | null;
    const creditUrl = formData.get('creditUrl') as string | null;
    const date = formData.get('date') as string | null;
    const defaultCaption = formData.get('defaultCaption') as string | null;
    const uploadedByString = formData.get('profileId') as string | null

    let referenceObjectId: mongoose.Types.ObjectId | null = null;

    if (referenceString) {
      try {
        referenceObjectId = new mongoose.Types.ObjectId(referenceString);
      } catch (error) {
        console.error('Error converting reference to ObjectId:', error);
        return NextResponse.json({ error: 'Invalid reference ID format.' }, { status: 400 });
      }
    }

    let uploadedByObjectId: mongoose.Types.ObjectId | null = null;

    if (uploadedByString) {
      try {
        uploadedByObjectId = new mongoose.Types.ObjectId(uploadedByString);
      } catch (error) {
        console.error('Error converting reference to ObjectId:', error);
        return NextResponse.json({ error: 'Invalid reference ID format.' }, { status: 400 });
      }
    }

    console.log('Form Data:', Object.fromEntries(formData.entries())); // Log all form data

    if (!photoFile) {
      return NextResponse.json({ error: 'No photo file uploaded.' }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ error: 'Category is required.' }, { status: 400 });
    }

    // You can do similar checks for other required text fields

    if (photoFile.size > 2.5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image size exceeds the limit of 2.5MB.' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(photoFile.type)) {
      return NextResponse.json({ error: 'Please upload a JPG or PNG image.' }, { status: 400 });
    }

    const buffer = await photoFile.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Ensure the category directory exists within the uploads directory

    const newFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(photoFile.name)}`;
    const subFolder = newFileName.slice(0, 2);
    const categoryDir = path.join(uploadDir, subFolder);
    await ensureDirectoryExists(categoryDir);

    const newPath = path.join(categoryDir, newFileName);

    //Upload image to server//
    await fs.writeFile(newPath, Buffer.from(bytes));
    const imageUrl = `/images/uploads/${subFolder}/${newFileName}`;

    //Add image data to database//
    await connectUsers(); // Ensure database connection
  
    let fileName = newFileName;

    const newPhoto = await PhotoModel.create({
      category: category,
      sourceUrl: sourceUrl,
      fileName: fileName, // Assuming you have this field in your schema
      copyrightType: copyrightType,
      creditName: creditName,
      creditUrl: creditUrl,
      date: date,
      defaultCaption: defaultCaption,
      uploadedBy: uploadedByObjectId,
      status: "ok",
    });


    
    console.log(`New photo added to database`);
    //Update Peoples collection to include the new photo//
    if (referenceObjectId) {
      try {
        const updatedPerson = await mongoose.model('People').updateOne(
          { _id: referenceObjectId },
          { $push: { additionalPhotos: {photoId: newPhoto._id, caption: "test"} } }
        );

        console.log('Updated Person:', updatedPerson);

      } catch (updateError: any) {
        console.error('Error updating People collection:', updateError);
        // Handle the error appropriately (e.g., return an error response)
        return NextResponse.json({ error: 'Failed to update People collection.' }, { status: 500 });
      }
    }
    // You can now include the _id in your JSON response
    return NextResponse.json({
      photo: newPhoto,
      imageUrl: imageUrl,
      _id: newPhoto._id.toString(), // Convert ObjectId to string for JSON
    }, { status: 201 });



  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during photo upload.' }, { status: 500 });
  }
}