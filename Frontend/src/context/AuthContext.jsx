import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const r = localStorage.getItem("role");
    if (t) setToken(t);
    if (r) setRole(r);
  }, []);

  function loginSuccess(newToken, newRole) {
    setToken(newToken);
    setRole(newRole);
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
  }

  function logout() {
    setToken(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  return (
    <AuthContext.Provider value={{ token, role, loginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
}