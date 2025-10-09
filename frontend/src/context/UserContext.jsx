// File: src/context/UserContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

// Create Context
const UserContext = createContext();

// Provider Component
export const UserProvider = ({ children }) => {
  // Initial state: check localStorage for existing login
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        return { ...JSON.parse(storedUser), token: storedToken };
      }
      return null;
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return null;
    }
  });

  // Login user and store in localStorage
  const loginUser = (userData, token) => {
    const userWithToken = { ...userData, token };
    setUser(userWithToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  // Logout user and clear localStorage
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Update user details
  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  // Keep localStorage in sync if user state changes
  useEffect(() => {
    if (!user) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for consuming the UserContext
export const useUserContext = () => useContext(UserContext);
