import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage on app start
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData); // This sets the initial state
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function - CRITICAL: Must update state to trigger re-renders
  const login = (userData) => {
    try {
      // Create a new object to ensure React detects the change
      const newUser = { ...userData };
      console.log(newUser);

      // Update localStorage first
      localStorage.setItem("user", JSON.stringify(newUser));

      // Update context state - this triggers re-render of all consumers
      setUser(newUser);

      console.log("User logged in:", newUser); // Debug log
    } catch (error) {
      console.error("Failed to store user data:", error);
    }
  };

  // Logout function - clears both localStorage and state
  const logout = () => {
    try {
      localStorage.removeItem("user");
      setUser(null); // This triggers re-render
      console.log("User logged out"); // Debug log
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const contextValue = {
    user,
    loading,
    isLogin: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export default AuthContext;
