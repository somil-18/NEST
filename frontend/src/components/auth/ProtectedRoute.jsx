import { Navigate } from "react-router-dom";
// import useAuthStore from "@/store/useAuthStore";

const ProtectedRoute = ({ children, roles = [] }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const authenticated = !!user && !!user.access_token;
  // Not logged in
  if (!authenticated) {
    return <Navigate to="/" />;
  }

  // Logged in, but not authorized
  if (roles.length > 0 && !roles.includes(user?.user?.role)) {
    return <Navigate to="/" />;
  }
  // Logged in and authorized
  return children;
};

export default ProtectedRoute;
