import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/database/connectUsers';
  
export async function POST(req: Request) {
    let client = await connectToDatabase();
    try {
        client = await connectToDatabase();
    } catch (error) {
        return NextResponse.json({ error: 'Failed to connect to MongoDB' }, { status: 500 });
    }

    if (!client) {
        return NextResponse.json({ error: 'Failed to connect to MongoDB' }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { name, password } = body;

        if (!name || !password) {
        return NextResponse.json({ error: 'Missing name or password' }, { status: 400 });
        }

        const db = client.db('TribesOfMen');
        const collection = db.collection('users');

        const users = await collection
        .find({
            username: { $regex: name, $options: 'i' },
            // password: password,
        })
        .toArray();

        if (users.length === 0) {
        console.log(`No user found with username: ${name} and the provided password.`);
        }

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    } finally {
        await client.close();
    }
}

