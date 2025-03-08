import {jwtDecode} from "jwt-decode";

export const getAdminIdFromToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.id || null; 
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
