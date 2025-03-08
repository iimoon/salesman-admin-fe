import { useState, useEffect } from "react";
import axios from "axios";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const setAuthHeader = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (token && !isTokenExpired(token)) {
      setIsAuthenticated(true);
      setAuthHeader(token);
    } else {
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      setAuthHeader(null);
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

  useEffect(() => {
    checkAuth();
    setLoading(false);
  }, []);

  return { isAuthenticated, checkAuth, loading };
};
