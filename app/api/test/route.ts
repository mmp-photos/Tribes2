import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { login } from "../../lib/users/authenticateUser";

const SECRET_KEY: string = process.env.ACCESS_TOKEN_SECRET ?? "";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  const checkPass = await login(email, password);
  console.log(`Login result: ${checkPass}`);
  console.log(`Email from requst is ${email}`)

  if(checkPass){
  // Generate a simple JWT
    const token = jwt.sign({ user: { email } }, SECRET_KEY, { expiresIn: "1h" });
    return NextResponse.json({ token, user: { email } });
  } 
  
  else {
    const token = jwt.sign({ user: "incorrect" }, SECRET_KEY, { expiresIn: "1h" });
    return NextResponse.json({ token, user: { email } });

  }

}