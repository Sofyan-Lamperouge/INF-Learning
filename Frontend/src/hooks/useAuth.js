import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

// Dipakai di komponen/halaman: const { isAuthenticated, role } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
