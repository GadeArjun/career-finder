import React, { createContext, useContext, useState, useEffect } from "react";
import { useUserContext } from "./UserContext";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Create Context
const CollegeContext = createContext();

// Hook for easy access
export const useCollegeContext = () => useContext(CollegeContext);

// Provider Component
export const CollegeProvider = ({ children }) => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCollege, setSelectedCollege] = useState(null);
  const { user } = useUserContext();

  const token = localStorage.getItem("token");

  /* ----------------------------------------------------------
     🔹 Fetch All Colleges for Logged-in Owner
  ---------------------------------------------------------- */
  const fetchColleges = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/college/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setColleges(data.colleges || []);
        setError("");
      } else {
        setError(data.message || "Failed to load colleges.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Error loading colleges.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllColleges = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/college/all`);

      const data = await res.json();
      if (res.ok) {
        setError("");
        return data.colleges || [];
      } else {
        setError(data.message || "Failed to load colleges.");
        return [];
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Error loading colleges.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------------------------------
     🔹 Add New College
  ---------------------------------------------------------- */
  const addCollege = async (collegeData) => {
    try {
      const res = await fetch(`${API_URL}/api/college`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(collegeData),
      });

      const data = await res.json();
      if (res.ok) {
        setColleges((prev) => [data.college, ...prev]);
        return { success: true, message: "College added successfully." };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error("Add error:", err);
      return { success: false, message: "Error adding college." };
    }
  };

  /* ----------------------------------------------------------
     🔹 Update Existing College
  ---------------------------------------------------------- */
  const updateCollege = async (collegeId, updates) => {
    try {
      const res = await fetch(`${API_URL}/api/college/${collegeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (res.ok) {
        setColleges((prev) =>
          prev.map((col) => (col._id === collegeId ? data.college : col))
        );
        return { success: true, message: "College updated successfully." };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error("Update error:", err);
      return { success: false, message: "Error updating college." };
    }
  };

  /* ----------------------------------------------------------
     🔹 Delete College
  ---------------------------------------------------------- */
  const deleteCollege = async (collegeId) => {
    try {
      const res = await fetch(`${API_URL}/api/college/${collegeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setColleges((prev) => prev.filter((col) => col._id !== collegeId));
        return { success: true, message: "College deleted successfully." };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error("Delete error:", err);
      return { success: false, message: "Error deleting college." };
    }
  };

  /* ----------------------------------------------------------
     🔹 Get Single College by ID (from backend)
  ---------------------------------------------------------- */
  const getCollegeById = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/college/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setSelectedCollege(data);
        return { success: true, data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error("Get college error:", err);
      return { success: false, message: "Error fetching college details." };
    }
  };

  /* ----------------------------------------------------------
     🔹 Auto-fetch on mount (if user)
  ---------------------------------------------------------- */
  useEffect(() => {
    if (user?.role === "college" || user?.role === "admin") {
      fetchColleges();
    }
  }, [user, token]);

  return (
    <CollegeContext.Provider
      value={{
        colleges,
        loading,
        error,
        selectedCollege,
        fetchColleges,
        addCollege,
        updateCollege,
        deleteCollege,
        getCollegeById,
        setSelectedCollege,
        fetchAllColleges,
      }}
    >
      {children}
    </CollegeContext.Provider>
  );
};
