import {
  Navigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../hooks/useAuth.js";


export default function ProtectedRoute({
  children,
}) {

  const {
    isAuthenticated,
    loading,
  } = useAuth();


  if (loading) {

    return (
      <div>
        Memeriksa sesi login...
      </div>
    );
  }


  if (!isAuthenticated) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  return children;
}