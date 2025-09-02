import { Navigate } from "react-router-dom";
// import useAuthStore from "@/store/useAuthStore";

const ProtectedRoute = ({ children, roles = [] }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const token = localStorage.getItem("token");
  const authenticated = !!user && !!token;
  // Not logged in
  if (!authenticated) {
    return <Navigate to="/" />;
  }

  // Logged in, but not authorized
  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  // Logged in and authorized
  return children;
};

export default ProtectedRoute;
