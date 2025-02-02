import { MongoClient } from 'mongodb';

export async function connectUsers() {
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db('TribesOfMen');
    const collection = db.collection('users');
    return { client, collection };
}
