"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function AuthButton() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn, logout } = useAuth(); // Destructure logout
  // console.log(user);

  const handleAuthAction = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      logout(); // Call the logout function from AuthContext
    } else {
      router.push("/login");
    }
  };

  return (
    <button onClick={handleAuthAction} id="log-out-button">
      {isLoggedIn ? "Logout" : "Login"}
    </button>
  );
}