import { insertUser } from '@/app/lib/users/insertUser';

interface InsertUserResult {
    success: boolean;
    data?: any;
    error?: string;
}

export async function POST(req: Request): Promise<Response> {
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
            // return new Response(
            //     JSON.stringify({ success: false, error: "Missing required fields" }),
            //     { status: 400 }
            // );
            console.log(`No emoail or password provided`)
        }

        // const result: InsertUserResult = await insertUser({
        //     email,
        //     password,
        //     accountStatus,
        //     accountType,
        //     dateCreated,
        //     lastLogin,
        //     lastLogout,
        //     termsAccepted,
        //     termsAcceptedOn,
        //     profile,
        // });
        const result = insertUser(body);
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
