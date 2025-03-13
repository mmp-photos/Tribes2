"use client";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";

export default function LogoutButton() {
  const router = useRouter(); // Initialize the router

  const logout = () => {
    destroyCookie(null, "access_token"); // Delete the authentication cookie
    localStorage.removeItem("rcc_cookie_consent"); // Reset Cookie Consent
    router.push("/login"); // Redirect to login page
  };

  return (
    <button 
      onClick={() => {
        logout();
      }}
      id="log-out-button"
    >
      Logout
    </button>
  );
} 