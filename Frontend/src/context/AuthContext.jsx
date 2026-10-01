import { createContext, useState, useCallback } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));

  // Dipanggil setelah login sukses (lihat LoginPage.jsx).
  // role di sini datang LANGSUNG dari respons Backend -- frontend
  // tidak pernah menentukan role sendiri.
  const loginSuccess = useCallback((newToken, newRole) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    setToken(newToken);
    setRole(newRole);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
  }, []);

  const value = {
    isAuthenticated: Boolean(token),
    role,
    loginSuccess,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
