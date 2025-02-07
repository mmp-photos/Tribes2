import { NextResponse } from 'next/server';
import { withDatabase } from '@/app/lib/database/dbHelper';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, password } = body;

        if (!name || !password) {
            return NextResponse.json({ error: 'Missing name or password' }, { status: 400 });
        }

        const users = await withDatabase(async (collection) => {
            return await collection
                .find()
                .toArray();
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
