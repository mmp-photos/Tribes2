// /api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { login } from "../../lib/users/authenticateUser";

const SECRET_KEY: string = process.env.ACCESS_TOKEN_SECRET ?? "";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const loginResult = await login(email, password);
    console.log(`Login result: ${loginResult}`);

    if (loginResult.success) {
      const token = jwt.sign({ user: loginResult.user }, SECRET_KEY, { expiresIn: "1h" });
      return NextResponse.json({ token, user: loginResult.user }); // Include the full user object
    } else {
      console.log(`Login failed: ${loginResult.error}`);
      const response = NextResponse.json({ error: loginResult.error }, { status: 401 });
      console.log(`Response to client: ${JSON.stringify(response)}`);
      return response;
    }
  } catch (error) {
    console.error("API login error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}