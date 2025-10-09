import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public paths */}

        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Student Routes */}
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
      </Routes>
    </BrowserRouter>
  );
}
