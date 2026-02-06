// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import Layout from "./Layout/Layout";
// import Dashboard from "./pages/Student/Dashboard";
// import LandingPage from "./pages/LandingPage";
// import Profile from "./pages/common/Profile";
// import AptitudeTest from "./pages/Student/AptitudeTest";
// import ResultRecommendations from "./pages/Student/ResultRecommendations";
// import CoursesCollegeExplorer from "./pages/Student/CoursesCollegeExplorer";
// import GuidanceResourcesLearningPath from "./pages/Student/GuidanceResourcesLearningPath";
// import Register from "./pages/auth/Register";
// import Login from "./pages/auth/Login";
// import Settings from "./pages/common/Settings";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* public paths */}

//         <Route path="/" element={<LandingPage />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />

//         {/* Student Routes */}
//         <Route path="/student" element={<Layout />}>
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="profile" element={<Profile />} />
//           <Route path="aptitude-test" element={<AptitudeTest />} />
//           <Route path="recommendations" element={<ResultRecommendations />} />
//           <Route
//             path="explore-courses-college"
//             element={<CoursesCollegeExplorer />}
//           />
//           <Route
//             path="guidance-resources-path"
//             element={<GuidanceResourcesLearningPath />}
//           />
//           <Route path="settings" element={<Settings />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout/Layout";
import Dashboard from "./pages/Student/Dashboard";
import LandingPage from "./pages/LandingPage";
import Profile from "./pages/common/Profile";
import AptitudeTest from "./pages/Student/AptitudeTest";
import ResultRecommendations from "./pages/Student/ResultRecommendations";
import CoursesCollegeExplorer from "./pages/Student/CoursesCollegeExplorer";
import GuidanceResourcesLearningPath from "./pages/Student/GuidanceResourcesLearningPath";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Settings from "./pages/common/Settings";
// import NotFound from "./pages/common/NotFound"; // create this page
import { useUserContext } from "./context/UserContext";
import CollegeDashboard from "./pages/College/Dashboard";
import Colleges from "./pages/College/Colleges";
import CollegeDetail from "./pages/College/CollegeDetail";
// import Courses from "./pages/College/Courses";
// import CourseDetail from "./pages/College/CourseDetail";
import ManageCollege from "./pages/College/ManageCollege";
import ManageCompany from "./pages/Company/ManageCompany";
import CompanyDashboard from "./pages/Company/CompanyDashboard";
import CompaniesList from "./pages/Company/CompaniesList";
import ManageJobs from "./pages/Job/ManageJobs";
import CompanyJobsPage from "./pages/Job/CompanyjobsPage";
import JobEditor from "./pages/Job/JobEditor";
import CollegeCoursesPage from "./pages/Course/CollegeCoursesPage";
import CourseEditor from "./pages/Course/CourseEditor";

export default function App() {
  const { user } = useUserContext();
  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Student Routes */}
        {user && user.role === "student" && (
          <Route path="/student" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="aptitude-test" element={<AptitudeTest />} />
            <Route path="recommendations" element={<ResultRecommendations />} />
            <Route
              path="explore-courses-college"
              element={<CoursesCollegeExplorer />}
            />
            <Route
              path="guidance-resources-path"
              element={<GuidanceResourcesLearningPath />}
            />
            <Route path="settings" element={<Settings />} />
          </Route>
        )}

        {/* Protected routes with fallback */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute>
              <h1>Not Found</h1>
            </ProtectedRoute>
          }
        />

        {user && user.role === "college" && (
          <Route path="/college" element={<Layout />}>
            <Route path="dashboard" element={<CollegeDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="colleges" element={<Colleges />} />

            <Route path="courses/:collegeId" element={<CollegeCoursesPage />} />

            <Route path="course/add/:collegeId" element={<CourseEditor />} />
            <Route path="course/edit/:courseId" element={<CourseEditor />} />

            <Route path="colleges/:id" element={<ManageCollege />} />
            {/* <Route path="courses" element={<Courses />} /> */}
            {/* <Route path="course/:id" element={<CourseDetail />} /> */}

            <Route
              path="explore-courses-college"
              element={<CoursesCollegeExplorer />}
            />
            <Route
              path="guidance-resources-path"
              element={<GuidanceResourcesLearningPath />}
            />
            <Route path="settings" element={<Settings />} />
          </Route>
        )}

        <Route
          path="/college/*"
          element={
            <ProtectedRoute>
              <h1>Not Found</h1>
            </ProtectedRoute>
          }
        />

        {user && user.role === "company" && (
          <Route path="/company" element={<Layout />}>
            <Route path="dashboard" element={<CompanyDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="companys" element={<CompaniesList />} />
            {/* <Route path="jobs" element={<ManageJobs />} /> */}
            <Route path="jobs/:companyId" element={<CompanyJobsPage />} />
            <Route path="job/add/:companyId" element={<JobEditor />} />
            <Route path="job/edit/:jobId" element={<JobEditor />} />
            <Route path="companys/:id" element={<ManageCompany />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        )}

        <Route
          path="/company/*"
          element={
            <ProtectedRoute>
              <h1>Not Found</h1>
            </ProtectedRoute>
          }
        />

        {/* Wildcard route */}
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
