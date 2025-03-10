import { useState, useEffect } from "react";
import axios from "axios";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const setAuthHeader = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiryTime = payload.exp * 1000;
      return expiryTime < Date.now();
    } catch (error) {
      return true;
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem("token");

    if (token && !isTokenExpired(token)) {
      setAuthHeader(token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("token");
      setAuthHeader(null);
      setIsAuthenticated(false);
    }
  };

  const loginAuth = (token: string) => {
    localStorage.setItem("token", token);
    setAuthHeader(token);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    checkAuth();
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return { isAuthenticated, checkAuth, loginAuth, loading };
};
