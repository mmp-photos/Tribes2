import { connectUsers } from './connectUsers';
import { Collection, Document } from 'mongodb';

export async function withDatabase(fn: (collection: Collection<Document>) => Promise<any>) {
    let dbClient;
    try {
        const { client, collection } = await connectUsers(); // ✅ Correct function name
        dbClient = client;
        return await fn(collection);
    } catch (error) {
        console.error('Database operation failed:', error);
        throw error;
    } finally {
        if (dbClient) await dbClient.close();
    }
}
