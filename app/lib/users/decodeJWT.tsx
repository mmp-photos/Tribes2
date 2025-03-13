export function decodeJWT(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid JWT: Token must have three parts");
      return null;
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(base64);

    const jsonPayload = decodeURIComponent(
      decodedPayload
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("Invalid JWT: Failed to parse JSON payload", error);
    } else if (error instanceof TypeError){
      console.error("Invalid JWT: Failed to decode base64 payload", error);
    } else {
        console.error("Error decoding JWT:", error);
    }
    return null;
  }
}