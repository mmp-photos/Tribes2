"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { decodeJWT } from "../lib/users/decodeJWT";

// Define user type
interface User {
    id: string;
    email: string;
    role: "admin" | "user" | "editor"; // Adjust roles as needed
}

// Define context type
interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => void;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getCookie("access_token") as string | undefined;

        if (token && typeof token === "string") {
            const decodedUser = decodeJWT(token) as User; // Decode JWT and get user info
            setUser(decodedUser);
        }

        setLoading(false);
    }, []);

    const logout = () => {
        document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook to use Auth Context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
