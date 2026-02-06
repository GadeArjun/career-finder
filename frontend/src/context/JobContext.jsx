import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const JobContext = createContext();
export const useJobs = () => useContext(JobContext);

const API = `${import.meta.env.VITE_BACKEND_URL}/api/job`;

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const axiosAuth = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });

  // ====================================================
  // 🔹 GET ALL JOBS
  // ====================================================
  const getAllJobs = async (filters = {}) => {
    try {
      setLoading(true);
      const res = await axiosAuth.get(API, { params: filters });
      setJobs(res.data.jobs);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // 🔹 GET JOB BY ID
  // ====================================================
  const getJobById = async (id) => {
    try {
      setLoading(true);
      console.log(`${API}/${id}`);
      const res = await axiosAuth.get(`${API}/${id}/one`);
      setJobDetails(res.data.job);
      console.log({ a: res.data });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch job");
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // 🔹 GET JOBS BY COMPANY
  // ====================================================
  const getJobsByCompany = async (companyId) => {
    try {
      setLoading(true);
      const res = await axiosAuth.get(`${API}/${companyId}`);
      setCompanyJobs(res.data.jobs || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch company jobs");
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // 🔹 CREATE JOB
  // ====================================================
  const createJob = async (data) => {
    try {
      setLoading(true);
      console.log({ API });
      await axiosAuth.post(API, data);
      await getAllJobs(); // refresh list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // 🔹 UPDATE JOB
  // ====================================================
  const updateJob = async (id, data) => {
    try {
      setLoading(true);
      await axiosAuth.post(`${API}/${id}`, data);
      await getAllJobs();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update job");
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // 🔹 DELETE JOB
  // ====================================================
  const deleteJob = async (id) => {
    try {
      setLoading(true);
      await axiosAuth.delete(`${API}/${id}`);
      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        jobDetails,
        companyJobs,
        loading,
        error,
        getAllJobs,
        getJobById,
        getJobsByCompany,
        createJob,
        updateJob,
        deleteJob,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
