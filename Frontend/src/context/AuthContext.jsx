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

import { sesi } from '../utils/storage.js';


export const AuthContext =
  createContext(null);


export function AuthProvider({
  children,
}) {
  const [token, setToken] =
    useState(() =>
      sesi.getItem(
        'token'
      )
    );

  const [role, setRole] =
    useState(() =>
      sesi.getItem(
        'role'
      )
    );

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  const logout =
    useCallback(() => {
      sesi.removeItem(
        'token'
      );

      sesi.removeItem(
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


        sesi.setItem(
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

        sesi.setItem(
          'token',
          newToken
        );

        sesi.setItem(
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