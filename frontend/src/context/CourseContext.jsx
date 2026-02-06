// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useUserContext } from "./UserContext";

// const CourseContext = createContext();
// const API_URL = import.meta.env.VITE_BACKEND_URL;

// export const CourseProvider = ({ children }) => {
//   const { user } = useUserContext();
//   console.log({ user });

//   const [courses, setCourses] = useState([]);
//   const [learningPaths, setLearningPaths] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [selectedLearningPath, setSelectedLearningPath] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   /* -----------------------------------
//      🔹 Fetch all courses (optionally by college)
//   ----------------------------------- */
//   const fetchCourses = async (collegeId = null, search = "") => {
//     try {
//       setLoading(true);
//       setError(null);
//       const url = new URL(`${API_URL}/api/courses`);
//       if (collegeId) url.searchParams.append("collegeId", collegeId);
//       if (search) url.searchParams.append("search", search);

//       const res = await fetch(url, {
//         headers: { Authorization: `Bearer ${user?.token}` },
//       });
//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Failed to fetch courses");
//       setCourses(data.courses || []);
//       return { success: true, data: data.courses };
//     } catch (err) {
//       console.error("Fetch Courses Error:", err);
//       setError(err.message);
//       return { success: false, message: err.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   /* -----------------------------------
//      🔹 Fetch single course + learning path
//   ----------------------------------- */
//   const fetchCourseById = async (courseId) => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_URL}/api/courses/${courseId}`, {
//         headers: { Authorization: `Bearer ${user?.token}` },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       setSelectedCourse(data.course);
//       setSelectedLearningPath(data.learningPath);
//       return { success: true, data };
//     } catch (err) {
//       console.error("Fetch Course Error:", err);
//       setError(err.message);
//       return { success: false, message: err.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* -----------------------------------
//      🔹 Add Course
//   ----------------------------------- */
//   const addCourse = async (courseData) => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_URL}/api/courses`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user?.token}`,
//         },
//         body: JSON.stringify(courseData),
//       });
//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message);
//       setCourses((prev) => [...prev, data.course]);
//       return { success: true, data: data.course };
//     } catch (err) {
//       console.error("Add Course Error:", err);
//       setError(err.message);
//       return { success: false, message: err.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* -----------------------------------
//      🔹 Update Course
//   ----------------------------------- */
//   const updateCourse = async (courseId, updates) => {
//     try {
//       const res = await fetch(`${API_URL}/api/courses/${courseId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user?.token}`,
//         },
//         body: JSON.stringify(updates),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       setCourses((prev) =>
//         prev.map((c) => (c._id === courseId ? data.course : c))
//       );
//       return { success: true, data: data.course };
//     } catch (err) {
//       console.error("Update Course Error:", err);
//       setError(err.message);
//       return { success: false, message: err.message };
//     }
//   };

//   /* -----------------------------------
//      🔹 Delete Course
//   ----------------------------------- */
//   const deleteCourse = async (courseId) => {
//     try {
//       const res = await fetch(`${API_URL}/api/courses/${courseId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${user?.token}` },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       setCourses((prev) => prev.filter((c) => c._id !== courseId));
//       return { success: true };
//     } catch (err) {
//       console.error("Delete Course Error:", err);
//       setError(err.message);
//       return { success: false, message: err.message };
//     }
//   };

//   /* -----------------------------------
//      🧭 Learning Path Methods
//   ----------------------------------- */

//   // Create new learning path
//   const createLearningPath = async (pathData) => {
//     try {
//       const res = await fetch(`${API_URL}/api/learning-paths`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user?.token}`,
//         },
//         body: JSON.stringify(pathData),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);
//       setLearningPaths((prev) => [...prev, data.path]);
//       return { success: true, data: data.path };
//     } catch (err) {
//       console.error("Create Learning Path Error:", err);
//       return { success: false, message: err.message };
//     }
//   };

//   // Get all learning paths
//   const fetchLearningPaths = async (courseId = null) => {
//     try {
//       setLoading(true);
//       const url = new URL(`${API_URL}/api/learning-paths`);
//       if (courseId) url.searchParams.append("courseId", courseId);

//       const res = await fetch(url, {
//         headers: { Authorization: `Bearer ${user?.token}` },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       setLearningPaths(data.paths);
//       return { success: true, data: data.paths };
//     } catch (err) {
//       console.error("Fetch Learning Paths Error:", err);
//       return { success: false, message: err.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update a learning path
//   const updateLearningPath = async (id, updates) => {
//     try {
//       const res = await fetch(`${API_URL}/api/learning-paths/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user?.token}`,
//         },
//         body: JSON.stringify(updates),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       setLearningPaths((prev) =>
//         prev.map((lp) => (lp._id === id ? data.path : lp))
//       );
//       return { success: true, data: data.path };
//     } catch (err) {
//       console.error("Update Learning Path Error:", err);
//       return { success: false, message: err.message };
//     }
//   };

//   // Delete a learning path
//   const deleteLearningPath = async (id) => {
//     try {
//       const res = await fetch(`${API_URL}/api/learning-paths/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${user?.token}` },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       setLearningPaths((prev) => prev.filter((lp) => lp._id !== id));
//       return { success: true };
//     } catch (err) {
//       console.error("Delete Learning Path Error:", err);
//       return { success: false, message: err.message };
//     }
//   };

//   // Add stage to an existing path
//   const addStage = async (pathId, stageData) => {
//     try {
//       const res = await fetch(
//         `${API_URL}/api/learning-paths/${pathId}/add-stage`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${user?.token}`,
//           },
//           body: JSON.stringify({ stage: stageData }),
//         }
//       );
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       setSelectedLearningPath(data.path);
//       return { success: true, data: data.path };
//     } catch (err) {
//       console.error("Add Stage Error:", err);
//       return { success: false, message: err.message };
//     }
//   };

//   return (
//     <CourseContext.Provider
//       value={{
//         courses,
//         learningPaths,
//         selectedCourse,
//         selectedLearningPath,
//         loading,
//         error,
//         fetchCourses,
//         fetchCourseById,
//         addCourse,
//         updateCourse,
//         deleteCourse,
//         createLearningPath,
//         fetchLearningPaths,
//         updateLearningPath,
//         deleteLearningPath,
//         addStage,
//         setSelectedCourse,
//         setSelectedLearningPath,
//       }}
//     >
//       {children}
//     </CourseContext.Provider>
//   );
// };

// export const useCourseContext = () => useContext(CourseContext);

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
      console.log(res.data);
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
