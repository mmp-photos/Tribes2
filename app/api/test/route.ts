import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    console.log('API route accessed:', req.url);
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    if (query === '123') {
        return NextResponse.json({ message: 'Query received successfully!', query });
    } else {
        return NextResponse.json({ message: 'Invalid query parameter!' }, { status: 400 });
    }
}
