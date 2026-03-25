import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const CourseContext = createContext();
export const useCourses = () => useContext(CourseContext);

const API = `${import.meta.env.VITE_BACKEND_URL}/api/course`;

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [courseDetails, setCourseDetails] = useState(null);
  const [collegeCourses, setCollegeCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const axiosAuth = axios.create({
    baseURL: API,
    headers: { Authorization: `Bearer ${token}` },
  });

  // ====================================================
  // 🔹 GET ALL COURSES
  // ====================================================
  const getAllCourses = async (filters = {}) => {
    try {
      setLoading(true);
      const res = await axiosAuth.get("/", { params: filters });
      setCourses(res.data.courses);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };
  // ====================================================
  // 🔹 GET COURSE BY ID
  // ====================================================
  const getCourseById = async (id) => {
    try {
      setLoading(true);
      const res = await axiosAuth.get(`/${id}`);
      setCourseDetails(res.data.course);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch course");
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // 🔹 GET COURSES BY COLLEGE
  // ====================================================
  const getCoursesByCollege = async (collegeId) => {
    try {
      setLoading(true);
      const res = await axiosAuth.get(`/college/${collegeId}`);
      setCollegeCourses(res.data.courses);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch college courses"
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // 🔹 CREATE COURSE
  // ====================================================
  const createCourse = async (data) => {
    try {
      setLoading(true);
      await axiosAuth.post("/", data);
      await getAllCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // 🔹 UPDATE COURSE
  // ====================================================
  const updateCourse = async (id, data) => {
    try {
      setLoading(true);
      await axiosAuth.post(`/${id}`, data); // you used POST for update
      await getAllCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // 🔹 DELETE COURSE
  // ====================================================
  const deleteCourse = async (id) => {
    try {
      setLoading(true);
      await axiosAuth.delete(`/${id}`);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        courseDetails,
        collegeCourses,
        loading,
        error,
        getAllCourses,
        getCourseById,
        getCoursesByCollege,
        createCourse,
        updateCourse,
        deleteCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
