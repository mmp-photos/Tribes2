import { MongoClient } from 'mongodb';

let cachedClient: MongoClient | null = null;

export async function connectToDatabase(): Promise<MongoClient> {
    if (cachedClient) {
        return cachedClient;
    }

    const client = new MongoClient(process.env.ATLAS_URI!);

    try {
        await client.connect();
        console.log(`Connected to the database.`)
        cachedClient = client;
        return client;
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        throw new Error('Database connection failed');
    }
}
