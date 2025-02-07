import { insertUser } from '@/app/lib/users/insertUser';
import { connectToDatabase } from '@/app/lib/database/connectUsers';

interface InsertUserResult {
    success: boolean;
    data?: any;
    error?: string;
}

export async function POST(req: Request): Promise<Response> {
    const client = await connectToDatabase();
    if (!client) {
        throw new Error('Failed to connect to MongoDB');
    }
    const db = client.db('TribesOfMen');
    const collection = db.collection('users');
    const body = await req.json();
    
    try {
        const body = await req.json();

        const {
            email,
            password,
            accountStatus,
            accountType,
            dateCreated,
            lastLogin,
            lastLogout,
            termsAccepted,
            termsAcceptedOn,
            profile,
        } = body;

        if (!email || !password) {
            return new Response(
                JSON.stringify({ success: false, error: "Missing required fields" }),
                { status: 400 }
            );
            console.log(`No emoail or password provided`)
        }
        const result: InsertUserResult = await insertUser(body);

        if (result.success) {
            return new Response(JSON.stringify(result.data), { status: 201 });
        } else {
            return new Response(
                JSON.stringify({ success: false, error: result.error }),
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error in POST function:", error);
        return new Response(
            JSON.stringify({ success: false, error: "Internal server error" }),
            { status: 500 }
        );
    }
}
