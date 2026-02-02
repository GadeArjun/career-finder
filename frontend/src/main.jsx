import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { CollegeProvider } from "./context/CollegeContext.jsx";
import { CourseProvider } from "./context/CourseContext.jsx";
import { CompanyProvider } from "./context/CompanyContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <CollegeProvider>
        <CourseProvider>
          <CompanyProvider>
            <App />
          </CompanyProvider>
        </CourseProvider>
      </CollegeProvider>
    </UserProvider>
  </StrictMode>
);
