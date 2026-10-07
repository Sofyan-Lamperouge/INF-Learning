import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  getMe,
} from '../services/authService.js';


export const AuthContext =
  createContext(null);


export function AuthProvider({
  children,
}) {
  const [token, setToken] =
    useState(() =>
      localStorage.getItem(
        'token'
      )
    );

  const [role, setRole] =
    useState(() =>
      localStorage.getItem(
        'role'
      )
    );

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  const logout =
    useCallback(() => {
      localStorage.removeItem(
        'token'
      );

      localStorage.removeItem(
        'role'
      );

      setToken(null);
      setRole(null);
      setUser(null);
    }, []);


  useEffect(() => {
    let active = true;


    async function restoreSession() {
      if (!token) {
        if (active) {
          setLoading(false);
        }

        return;
      }


      try {
        const currentUser =
          await getMe();


        if (!active) {
          return;
        }


        setUser(
          currentUser
        );

        setRole(
          currentUser.peran
        );


        localStorage.setItem(
          'role',
          currentUser.peran
        );

      } catch {
        if (active) {
          logout();
        }

      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }


    restoreSession();


    return () => {
      active = false;
    };

  }, [
    token,
    logout,
  ]);


  const loginSuccess =
    useCallback(
      (
        newToken,
        newRole,
        newUser = null
      ) => {

        localStorage.setItem(
          'token',
          newToken
        );

        localStorage.setItem(
          'role',
          newRole
        );


        setToken(newToken);
        setRole(newRole);
        setUser(newUser);
      },
      []
    );


  const value = useMemo(
    () => ({
      token,
      role,
      user,
      loading,

      isAuthenticated:
        Boolean(
          token &&
          user
        ),

      loginSuccess,
      logout,
    }),

    [
      token,
      role,
      user,
      loading,
      loginSuccess,
      logout,
    ]
  );


  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}