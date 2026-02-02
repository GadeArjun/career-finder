import React, { createContext, useContext, useState, useEffect } from "react";
import { useUserContext } from "./UserContext";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const CompanyContext = createContext();

export const useCompanyContext = () => useContext(CompanyContext);

export const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useUserContext();
  const token = localStorage.getItem("token");

  /* ----------------------------------------------------------
     🔹 Fetch My Companies
  ---------------------------------------------------------- */
  const fetchCompanies = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/company/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setCompanies(data.companies || []);
        setError("");
      } else {
        setError(data.message || "Failed to load companies.");
      }
    } catch (err) {
      console.error("Fetch companies error:", err);
      setError("Error loading companies.");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------------------------------
     🔹 Add Company
  ---------------------------------------------------------- */
  const addCompany = async (companyData) => {
    try {
      const res = await fetch(`${API_URL}/api/company`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(companyData),
      });

      const data = await res.json();

      if (res.ok) {
        setCompanies((prev) => [data.company, ...prev]);
        return { success: true, message: "Company created successfully." };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error("Add company error:", err);
      return { success: false, message: "Error creating company." };
    }
  };

  /* ----------------------------------------------------------
     🔹 Update Company
  ---------------------------------------------------------- */
  const updateCompany = async (companyId, updates) => {
    try {
      const res = await fetch(`${API_URL}/api/company/${companyId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (res.ok) {
        setCompanies((prev) =>
          prev.map((comp) => (comp._id === companyId ? data.company : comp))
        );
        return { success: true, message: "Company updated successfully." };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error("Update company error:", err);
      return { success: false, message: "Error updating company." };
    }
  };

  /* ----------------------------------------------------------
     🔹 Delete Company
  ---------------------------------------------------------- */
  const deleteCompany = async (companyId) => {
    try {
      const res = await fetch(`${API_URL}/api/company/${companyId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setCompanies((prev) => prev.filter((c) => c._id !== companyId));
        return { success: true, message: "Company deleted successfully." };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error("Delete company error:", err);
      return { success: false, message: "Error deleting company." };
    }
  };

  /* ----------------------------------------------------------
     🔹 Get Company By ID
  ---------------------------------------------------------- */
  const getCompanyById = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/company/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setSelectedCompany(data.company || data);
        return { success: true, data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error("Get company error:", err);
      return { success: false, message: "Error fetching company details." };
    }
  };

  /* ----------------------------------------------------------
     🔹 Auto Load for Company/Admin
  ---------------------------------------------------------- */
  useEffect(() => {
    if (user?.role === "company" || user?.role === "admin") {
      fetchCompanies();
    }
  }, [user, token]);

  return (
    <CompanyContext.Provider
      value={{
        companies,
        selectedCompany,
        loading,
        error,
        fetchCompanies,
        addCompany,
        updateCompany,
        deleteCompany,
        getCompanyById,
        setSelectedCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
