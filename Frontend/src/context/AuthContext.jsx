import {
  createContext,
  useEffect,
  useState,
} from "react";

import { getMe } from "../services/authService.js";


export const AuthContext =
  createContext(null);


export function AuthProvider({
  children,
}) {

  const [token, setToken] =
    useState(
      localStorage.getItem(
        "token"
      )
    );

  const [role, setRole] =
    useState(
      localStorage.getItem(
        "role"
      )
    );

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    async function restoreSession() {

      if (!token) {

        setLoading(false);

        return;
      }


      try {

        const currentUser =
          await getMe();

        setUser(
          currentUser
        );

        setRole(
          currentUser.peran
        );

        localStorage.setItem(
          "role",
          currentUser.peran
        );

      } catch {

        logout();

      } finally {

        setLoading(false);
      }
    }


    restoreSession();

  }, []);


  function loginSuccess(
    newToken,
    newRole,
    newUser = null
  ) {

    localStorage.setItem(
      "token",
      newToken
    );

    localStorage.setItem(
      "role",
      newRole
    );


    setToken(newToken);
    setRole(newRole);
    setUser(newUser);
  }


  function logout() {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "role"
    );


    setToken(null);
    setRole(null);
    setUser(null);
  }


  const value = {
    token,
    role,
    user,
    loading,
    isAuthenticated:
      Boolean(token),
    loginSuccess,
    logout,
  };


  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}