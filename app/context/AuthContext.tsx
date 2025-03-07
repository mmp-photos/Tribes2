"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { decodeJWT } from "../lib/users/decodeJWT";
import { User } from '../lib/types/users';

// Create Context
import { AuthContextType } from '../lib/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [pageTitle, setPageTitle] = useState("Tribes of Men"); // Default title
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null); // Add token state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = getCookie("access_token") as string | undefined;
        console.log("Token from cookie:", storedToken);  // Debugging
    
        if (storedToken) {
            try {
                setToken(storedToken);
                const decodedUser = decodeJWT(storedToken);
                console.log("Decoded user:", decodedUser); // Debugging
                setUser(decodedUser?.user ?? null); // Ensure correct user structure
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
        setLoading(false);
    }, []);  

    const logout = () => {
        document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        setToken(null); // Clear token on logout
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, logout, pageTitle, setPageTitle }}>
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
