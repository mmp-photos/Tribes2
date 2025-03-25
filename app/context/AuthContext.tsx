"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { destroyCookie } from "nookies";
import { decodeJWT } from "../lib/users/decodeJWT";
import { User } from '../lib/types/users';

// Create Context
import { AuthContextType } from '../lib/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [pageTitle, setPageTitle] = useState("Tribes of Men"); // Default title
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState<string | null>(null); // Add token state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = getCookie("access_token");
        console.log("AuthContext: access_token cookie value:", storedToken);
    
        if (!storedToken || typeof storedToken !== "string" || storedToken.trim() === "") {
            console.warn("AuthContext: No valid access_token found in cookies.");
            setUser(null);
            setToken(null);
            setIsAdmin(false);
            setIsLoggedIn(false);
            setLoading(false);
            return;
        }
    
        try {
            const decodedUser = decodeJWT(storedToken);
            console.log("AuthContext: Decoded user:", decodedUser);
            if (decodedUser && decodedUser.user && decodedUser.user.profile) {
                setUser(decodedUser.user);
                setToken(storedToken);
                setIsLoggedIn(true);
                // Set isAdmin based on accountType
                if (decodedUser.user.profile.accountType === "chief" || decodedUser.user.profile.accountType === "owner") {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } else {
                console.warn("AuthContext: Invalid JWT or user data.");
                setUser(null);
                setToken(null);
                setIsLoggedIn(false);
                setIsAdmin(false); // Set isAdmin to false on error.
            }
        } catch (error) {
            console.error("AuthContext: Error decoding token:", error);
            setUser(null);
            setToken(null);
            setIsLoggedIn(false);
            setIsAdmin(false); // Set isAdmin to false on error.
        }
    
        setLoading(false);
    }, []);
    
        const setLoggedIn = (value: boolean) => {
        setIsLoggedIn(value);
    };

    const logout = () => {
        destroyCookie(null, "access_token");
        localStorage.removeItem("rcc_cookie_consent");
        setUser(null); //update the user state.
    };
        
    return (
        <AuthContext.Provider value={{ user, token, loading, pageTitle, isAdmin, isLoggedIn, logout, setPageTitle, setIsLoggedIn }}>
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