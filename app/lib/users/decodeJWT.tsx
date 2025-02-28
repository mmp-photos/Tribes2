import jwt from "jsonwebtoken";

export function decodeJWT(token: string) {
    try {
        return jwt.decode(token); // Decodes without verifying
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
}