import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const [projectsResponse, issuesResponse] =
        await Promise.all([
          axios.get(
            "http://localhost:5000/api/projects",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          axios.get(
            "http://localhost:5000/api/issues/saved",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

      console.log(
        "Projects:",
        projectsResponse.data
      );

      console.log(
        "Issues:",
        issuesResponse.data
      );

      setProjects(
        Array.isArray(projectsResponse.data)
          ? projectsResponse.data
          : []
      );

      setIssues(
        Array.isArray(issuesResponse.data)
          ? issuesResponse.data
          : []
      );
    } catch (error) {
      console.error(
        "Dashboard loading error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", {
          replace: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DASHBOARD STATISTICS
  // ==========================================

  const totalProjects = projects.length;
  const totalIssues = issues.length;

  const openIssues = issues.filter(
    (issue) =>
      !issue.status ||
      issue.status === "Open"
  ).length;

  const inProgressIssues = issues.filter(
    (issue) =>
      issue.status === "In Progress"
  ).length;

  const inReviewIssues = issues.filter(
    (issue) =>
      issue.status === "In Review"
  ).length;

  const resolvedIssues = issues.filter(
    (issue) =>
      issue.status === "Resolved"
  ).length;

  // ==========================================
  // RECENT ISSUES
  // ==========================================

  const recentIssues = [...issues]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 5);

  // ==========================================
  // RECENT PROJECTS
  // ==========================================

  const recentProjects = [...projects]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 4);

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          fontSize: "18px",
        }}
      >
        Loading dashboard...
      </div>
    );
  }

  // ==========================================
  // DASHBOARD UI
  // ==========================================

  return (
    <div>
      {/* =====================================
          HEADER
      ====================================== */}

      <div className="page-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Welcome back! Here's what's
            happening with your workspace.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() =>
            navigate("/create-issue")
          }
        >
          + Create Issue
        </button>
      </div>

      {/* =====================================
          STATISTICS
      ====================================== */}

      <div className="stats-grid">

        {/* TOTAL PROJECTS */}

        <div className="stat-card">
          <div className="stat-row">
            <div>
              <p>Total Projects</p>
              <h2>{totalProjects}</h2>
            </div>

            <div className="stat-icon">
              ◫
            </div>
          </div>
        </div>

        {/* TOTAL ISSUES */}

        <div className="stat-card">
          <div className="stat-row">
            <div>
              <p>Total Issues</p>
              <h2>{totalIssues}</h2>
            </div>

            <div className="stat-icon">
              ◉
            </div>
          </div>
        </div>

        {/* OPEN ISSUES */}

        <div className="stat-card">
          <div className="stat-row">
            <div>
              <p>Open Issues</p>
              <h2>{openIssues}</h2>
            </div>

            <div className="stat-icon">
              !
            </div>
          </div>
        </div>

        {/* IN PROGRESS */}

        <div className="stat-card">
          <div className="stat-row">
            <div>
              <p>In Progress</p>
              <h2>{inProgressIssues}</h2>
            </div>

            <div className="stat-icon">
              ↻
            </div>
          </div>
        </div>

        {/* IN REVIEW */}

        <div className="stat-card">
          <div className="stat-row">
            <div>
              <p>In Review</p>
              <h2>{inReviewIssues}</h2>
            </div>

            <div className="stat-icon">
              ◎
            </div>
          </div>
        </div>

        {/* RESOLVED */}

        <div className="stat-card">
          <div className="stat-row">
            <div>
              <p>Resolved</p>
              <h2>{resolvedIssues}</h2>
            </div>

            <div className="stat-icon">
              ✓
            </div>
          </div>
        </div>
      </div>

      {/* =====================================
          LOWER DASHBOARD
      ====================================== */}

      <div className="dashboard-grid">

        {/* ===================================
            RECENT ISSUES
        ==================================== */}

        <div className="panel">
          <div className="panel-header">
            <h2>Recent Issues</h2>

            <button
              className="primary-btn"
              onClick={() =>
                navigate("/issues")
              }
            >
              View All
            </button>
          </div>

          {recentIssues.length === 0 ? (
            <div className="empty-state">
              <h3>No issues yet</h3>

              <p>
                Create your first issue to
                start tracking bugs.
              </p>

              <button
                className="primary-btn"
                onClick={() =>
                  navigate("/create-issue")
                }
              >
                + Create Issue
              </button>
            </div>
          ) : (
            recentIssues.map((issue) => (
              <div
                className="issue-row"
                key={issue._id}
              >
                <h4>
                  {issue.title ||
                    issue.description ||
                    "Untitled Issue"}
                </h4>

                <p>
                  {issue.status || "Open"}
                  {" • "}
                  {issue.priority || "Medium"}
                </p>
              </div>
            ))
          )}
        </div>

        {/* ===================================
            PROJECTS
        ==================================== */}

        <div className="panel">
          <div className="panel-header">
            <h2>Your Projects</h2>

            <button
              className="primary-btn"
              onClick={() =>
                navigate("/projects")
              }
            >
              View All
            </button>
          </div>

          {recentProjects.length === 0 ? (
            <div className="empty-state">
              <h3>No projects yet</h3>

              <p>
                Create your first project to
                organize your issues.
              </p>

              <button
                className="primary-btn"
                onClick={() =>
                  navigate("/projects")
                }
              >
                + Create Project
              </button>
            </div>
          ) : (
            recentProjects.map((project) => (
              <div
                className="project-mini-card"
                key={project._id}
              >
                <h4>
                  {project.projectName}
                </h4>

                <p>
                  {project.description ||
                    "No description"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}