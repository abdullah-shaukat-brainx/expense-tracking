import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export const isAuthenticated = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return false;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds

    // Check if the token is expired
    if (decodedToken.exp < currentTime) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error decoding token:", error);
    toast.error("Logging out User!");
    return false;
  }
};
