import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

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
    localStorage.clear();
    toast.error("Logging out User!");
    return false;
  }
};

// Custom hook for debounce
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
