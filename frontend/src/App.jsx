import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import Dashboard from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";
import IssuesPage from "./pages/IssuesPage";
import TeamPage from "./pages/TeamPage";
import CreateIssueForm from "./pages/CreateIssueForm";
import ActivityPage from "./pages/ActivityPage";
import SprintPage from "./pages/SprintPage";

import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==========================
            DEFAULT
        ========================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* ==========================
            PUBLIC ROUTES
        ========================== */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        {/* ==========================
            MAIN APPLICATION

            Everything here gets:
            Sidebar + Topbar
        ========================== */}

        <Route element={<Layout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/projects"
            element={<ProjectPage />}
          />

          <Route
            path="/issues"
            element={<IssuesPage />}
          />
          <Route path="/team" element={<TeamPage />} />

          <Route
            path="/create-issue"
            element={<CreateIssueForm />}
          />

           <Route
    path="/activity"
    element={<ActivityPage />}
  />


<Route path="/sprints" element={<SprintPage />} />
        </Route>

        {/* ==========================
            INVALID URL
        ========================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;