import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/databasae/connectUsers';

export async function POST(req: Request) {

    let client = await connectToDatabase();
    if (!client) {
        return NextResponse.json({ error: 'Failed to connect to MongoDB' }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: 'Missing name or password' }, { status: 400 });
        }

        const db = client.db('TribesOfMen');
        const collection = db.collection('users');
        console.log(`Connected to the database.`)
        const users = await collection
            .find({
                username: { $regex: name, $options: 'i' },
                // password: password, (Uncomment and use if password is needed in the query)
            })
            .toArray();

        if (users.length === 0) {
            console.log(`No user found with username: ${name}.`);
        }
        console.log(users);
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    } finally {
        await client.close();
    }
}
