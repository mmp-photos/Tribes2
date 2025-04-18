// app/api/photos/route.ts

import { promises as fs } from 'fs';
import path from 'path';
import formidable from 'formidable'; // We might not need formidable directly
import { NextRequest, NextResponse } from 'next/server';

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
    bodyParser: false, // Still important to disable default parsing
  },
};

export async function POST(req: NextRequest) {
  try {
    await ensureDirectoryExists(uploadDir);
    const formData = await req.formData();
    const photoFile = formData.get('photo') as File | null;

    if (!photoFile) {
      return NextResponse.json({ error: 'No photo file uploaded.' }, { status: 400 });
    }

    if (photoFile.size > 2.5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image size exceeds the limit of 2.5MB.' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(photoFile.type)) {
      return NextResponse.json({ error: 'Please upload a JPG or PNG image.' }, { status: 400 });
    }

    const buffer = await photoFile.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    const newFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(photoFile.name)}`;
    const newPath = path.join(uploadDir, newFileName);

    await fs.writeFile(newPath, Buffer.from(bytes));
    const imageUrl = `/images/uploads/${newFileName}`;

    return NextResponse.json({ message: 'Photo uploaded successfully!', imageUrl }, { status: 200 });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during photo upload.' }, { status: 500 });
  }
}