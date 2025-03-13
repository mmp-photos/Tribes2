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
        console.log("AuthContext: Attempting to get access_token cookie...");
        const storedToken = getCookie("access_token");
        console.log("AuthContext: access_token cookie value:", storedToken);
    
        if (!storedToken || typeof storedToken !== "string" || storedToken.trim() === "") {
            console.warn("AuthContext: No valid access_token found in cookies.");
            setUser(null);
            setToken(null);
            setLoading(false);
            return;
        }
    
        try {
            const decodedUser = decodeJWT(storedToken);
            console.log("AuthContext: Decoded user:", decodedUser);
            if (decodedUser && decodedUser.user) {
                setUser(decodedUser.user);
                setToken(storedToken);
            } else {
                console.warn("AuthContext: Invalid JWT or user data.");
                setUser(null);
                setToken(null);
            }
        } catch (error) {
            console.error("AuthContext: Error decoding token:", error);
            setUser(null);
            setToken(null);
        }
    
        console.log("AuthContext: User state:", user);
        console.log("AuthContext: Token state:", token);
        setLoading(false);
    }, []);
        
    return (
        <AuthContext.Provider value={{ user, token, loading, pageTitle, setPageTitle }}>
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
