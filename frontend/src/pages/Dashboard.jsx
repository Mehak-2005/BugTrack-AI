import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Team member information
  const [teamMember, setTeamMember] = useState(null);
  const [myProject, setMyProject] = useState(null);
  const [isTeamMember, setIsTeamMember] = useState(false);

  const [loading, setLoading] = useState(true);

  // AI insights
  const [aiInsights, setAiInsights] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    const loadDashboard = async () => {
      const token = localStorage.getItem("token");
      const loginType = localStorage.getItem("loginType");

      // ----------------------------------------
      // CHECK LOGIN
      // ----------------------------------------

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        setLoading(true);

        // ======================================
        // TEAM MEMBER DASHBOARD
        // ======================================

        if (loginType === "team-member") {
          setIsTeamMember(true);

          const response = await axios.get(
            "http://localhost:5000/api/team/my-project",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log(
            "TEAM MEMBER PROJECT:",
            response.data
          );

          // Team member information
          setTeamMember(
            response.data.teamMember || null
          );

          // Assigned project
          setMyProject(
            response.data.project || null
          );

          // Issues belonging to the project
          setIssues(
            Array.isArray(response.data.issues)
              ? response.data.issues
              : []
          );
          const totalIssues = isTeamMember
  ? issues.length
  : analytics?.summary?.totalDefects ?? 0;

          return;
        }

        // ======================================
        // NORMAL USER DASHBOARD
        // ======================================

        setIsTeamMember(false);

        const [
          projectsResponse,
          issuesResponse,
          analyticsResponse,
        ] = await Promise.all([
          // Projects
          axios.get(
            "http://localhost:5000/api/projects",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          // Issues
          axios.get(
            "http://localhost:5000/api/issues",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          // Analytics
          axios.get(
            "http://localhost:5000/api/analytics/dashboard",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

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

        setAnalytics(
          analyticsResponse.data
        );

      } catch (error) {
        console.error(
          "Dashboard loading error:",
          error
        );

        // --------------------------------------
        // INVALID TOKEN
        // --------------------------------------

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("teamMember");
          localStorage.removeItem("project");
          localStorage.removeItem("loginType");

          navigate("/login", {
            replace: true,
          });
        }

      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  // ==========================================
  // DASHBOARD STATISTICS
  // ==========================================

  const totalProjects = isTeamMember
    ? myProject
      ? 1
      : 0
    : projects.length;

  const totalIssues = isTeamMember
    ? issues.length
    : analytics?.summary?.totalDefects ?? 0;

  const openIssues = isTeamMember
    ? issues.filter(
        (issue) => issue.status === "Open"
      ).length
    : analytics?.summary?.openDefects ?? 0;

  const inProgressIssues = isTeamMember
    ? issues.filter(
        (issue) => issue.status === "In Progress"
      ).length
    : analytics?.summary?.inProgressDefects ?? 0;

  const inReviewIssues = isTeamMember
    ? issues.filter(
        (issue) => issue.status === "In Review"
      ).length
    : analytics?.summary?.inReviewDefects ?? 0;

  const resolvedIssues = isTeamMember
    ? issues.filter(
        (issue) => issue.status === "Resolved"
      ).length
    : analytics?.summary?.resolvedDefects ?? 0;

  // ==========================================
  // AVERAGE RESOLUTION TIME
  // ==========================================

  const averageResolutionTime =
    analytics?.summary?.averageResolutionTime ?? 0;

  // ==========================================
  // CHART DATA
  // ==========================================

  const statusChartData =
    analytics?.defectsByStatus || [];

  const severityChartData =
    analytics?.defectsBySeverity || [];

  const categoryChartData =
    analytics?.defectsByCategory || [];

  const developerWorkloadData =
    Array.isArray(
      analytics?.developerWorkload
    )
      ? analytics.developerWorkload
      : [];

  const defectTrendsData =
    Array.isArray(
      analytics?.defectTrends
    )
      ? analytics.defectTrends
      : [];

  // ==========================================
  // RECENT ISSUES
  // ==========================================

  const sortedIssues = [...issues].sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  );

  // Normal user sees latest 5.
  // Team member sees all project issues.
  const recentIssues = isTeamMember
    ? sortedIssues
    : sortedIssues.slice(0, 5);

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
  // GENERATE AI ANALYTICS INSIGHTS
  // ==========================================

  const handleGenerateAIInsights = async () => {
    try {
      setAiLoading(true);
      setAiError("");
      setAiInsights([]);

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/analytics/insights",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to generate AI analytics insights"
        );
      }

      setAiInsights(
        data.aiInsights || []
      );

    } catch (error) {
      console.error(
        "AI Insights Error:",
        error
      );

      setAiError(
        error.message ||
          "Failed to generate AI analytics insights"
      );

    } finally {
      setAiLoading(false);
    }
  };

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
    <div className="dashboard-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="page-header">

        <div>

          {isTeamMember ? (
            <>
              <p className="dashboard-label">
                PROJECT OVERVIEW
              </p>

              <h1>
                {myProject?.projectName ||
                  "Dashboard"}
              </h1>

              <p>
                {myProject?.description ||
                  "View and manage issues assigned to your project."}
              </p>
            </>
          ) : (
            <>
              <h1>Dashboard</h1>

              <p>
                Welcome back! Here's what's
                happening with your workspace.
              </p>
            </>
          )}

        </div>

        {/* Create Issue button only for normal users */}

        {!isTeamMember && (
          <button
            className="primary-btn"
            onClick={() =>
              navigate("/create-issue")
            }
          >
            + Create Issue
          </button>
        )}

      </div>

      {/* =====================================
          TEAM MEMBER INFORMATION
      ====================================== */}

      {isTeamMember &&
        teamMember &&
        myProject && (
          <div className="team-member-project-card">

            {/* MEMBER INFORMATION */}

            <div className="team-member-project-info">

              <div className="team-avatar">
                {teamMember.name
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <div>

                <h2>
                  {teamMember.name}
                </h2>

                <p>
                  {teamMember.role}
                </p>

                <span>
                  {teamMember.email}
                </span>

              </div>

            </div>

            {/* MEMBER DETAILS */}

            <div className="team-member-details">

              <div>
                <strong>
                  Project
                </strong>

                <span>
                  {myProject.projectName}
                </span>
              </div>

              <div>
                <strong>
                  Experience
                </strong>

                <span>
                  {teamMember.experience || 0}
                  {" "}
                  years
                </span>
              </div>

              <div>
                <strong>
                  Workload
                </strong>

                <span>
                  {teamMember.workload || 0}%
                </span>
              </div>

            </div>

          </div>
        )}

      {/* =====================================
          STATISTICS
      ====================================== */}

      <div className="stats-grid">

        {/* TOTAL PROJECTS */}

        <div className="stat-card">

          <div className="stat-row">

            <div>
              <p>
                {isTeamMember
                  ? "Assigned Project"
                  : "Total Projects"}
              </p>

              <h2>
                {totalProjects}
              </h2>
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

              <p>
                {isTeamMember
                  ? "Project Issues"
                  : "Total Issues"}
              </p>

              <h2>
                {totalIssues}
              </h2>

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

              <p>
                Open Issues
              </p>

              <h2>
                {openIssues}
              </h2>

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

              <p>
                In Progress
              </p>

              <h2>
                {inProgressIssues}
              </h2>

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

              <p>
                In Review
              </p>

              <h2>
                {inReviewIssues}
              </h2>

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

              <p>
                Resolved
              </p>

              <h2>
                {resolvedIssues}
              </h2>

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
            ISSUES
        ==================================== */}

        <div className="panel">

          <div className="panel-header">

            <h2>
              {isTeamMember
                ? "Project Issues"
                : "Recent Issues"}
            </h2>

            <button
  className="primary-btn"
  onClick={() => navigate("/projects")}
>
  View All
</button>

          </div>

          {/* NO ISSUES */}

          {recentIssues.length === 0 ? (

            <div className="empty-state">

              <h3>
                No issues yet
              </h3>

              <p>
                {isTeamMember
                  ? "No issues have been assigned to this project yet."
                  : "Create your first issue to start tracking bugs."}
              </p>

              {!isTeamMember && (
                <button
                  className="primary-btn"
                  onClick={() =>
                    navigate(
                      "/create-issue"
                    )
                  }
                >
                  + Create Issue
                </button>
              )}

            </div>

          ) : (

            /* ISSUE LIST */

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
                  {issue.status ||
                    "Open"}

                  {" • "}

                  {issue.priority ||
                    "Medium"}
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

            <h2>
              {isTeamMember
                ? "Assigned Project"
                : "Your Projects"}
            </h2>

            <button
              className="primary-btn"
              onClick={() =>
                navigate("/projects")
              }
            >
              View All
            </button>

          </div>

          {/* =================================
              TEAM MEMBER PROJECT
          ================================= */}

          {isTeamMember ? (

            myProject ? (

              <div className="project-mini-card">

                <h4>
                  {myProject.projectName}
                </h4>

                <p>
                  {myProject.description ||
                    "No project description available."}
                </p>

                <p>
                  <strong>
                    Access:
                  </strong>{" "}
                  Team Member
                </p>

              </div>

            ) : (

              <div className="empty-state">

                <h3>
                  No project assigned
                </h3>

                <p>
                  You currently don't have
                  a project assigned.
                </p>

              </div>

            )

          ) : (

            /* =================================
               NORMAL USER PROJECTS
            ================================= */

            recentProjects.length === 0 ? (

              <div className="empty-state">

                <h3>
                  No projects yet
                </h3>

                <p>
                  Create your first project
                  to organize your issues.
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

              recentProjects.map(
                (project) => (

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

                )
              )

            )

          )}

        </div>

      </div>

      {/* =====================================
          ADVANCED ANALYTICS
          ONLY FOR NORMAL USERS
      ====================================== */}

      {!isTeamMember && (
        <div className="analytics-section">

          <h2 className="analytics-title">
            Advanced Analytics
          </h2>

          <div className="analytics-grid">

            {/* =================================
                DEFECTS BY STATUS
            ================================== */}

            <div className="panel chart-panel">

              <h2>
                Defects by Status
              </h2>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart
                  data={statusChartData}
                >

                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: "#6b5b5b",
                    }}
                  />

                  <YAxis
                    tick={{
                      fill: "#6b5b5b",
                    }}
                  />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="value"
                    name="Issues"
                    fill="#8f3f55"
                    radius={[
                      8,
                      8,
                      0,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

            {/* =================================
                DEFECTS BY SEVERITY
            ================================== */}

            <div className="panel chart-panel">

              <h2>
                Defects by Severity
              </h2>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart
                  data={severityChartData}
                >

                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: "#6b5b5b",
                    }}
                  />

                  <YAxis
                    tick={{
                      fill: "#6b5b5b",
                    }}
                  />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="value"
                    name="Issues"
                    radius={[
                      8,
                      8,
                      0,
                      0,
                    ]}
                  >

                    {severityChartData.map(
                      (entry, index) => {

                        const colors = [
                          "#b84c4c",
                          "#9b3552",
                          "#d49a4f",
                          "#7c9a6d",
                        ];

                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              colors[
                                index %
                                  colors.length
                              ]
                            }
                          />
                        );
                      }
                    )}

                  </Bar>

                </BarChart>

              </ResponsiveContainer>

            </div>

            {/* =================================
                DEFECTS BY CATEGORY
            ================================== */}

            <div className="panel chart-panel">

              <h2>
                Defects by Category
              </h2>

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <PieChart>

                  <Pie
                    data={categoryChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label
                  >

                    {categoryChartData.map(
                      (entry, index) => {

                        const colors = [
                          "#8f3f55",
                          "#b96a7c",
                          "#d49a4f",
                          "#7c9a6d",
                          "#6f7ea8",
                        ];

                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              colors[
                                index %
                                  colors.length
                              ]
                            }
                          />
                        );
                      }
                    )}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            </div>

            {/* =================================
                DEVELOPER WORKLOAD
            ================================== */}

            <div className="panel chart-panel">

              <h2>
                Developer Workload
              </h2>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart
                  data={
                    developerWorkloadData
                  }
                >

                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: "#6b5b5b",
                    }}
                  />

                  <YAxis
                    tick={{
                      fill: "#6b5b5b",
                    }}
                  />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="value"
                    name="Assigned Issues"
                    fill="#8f3f55"
                    radius={[
                      8,
                      8,
                      0,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

            {/* =================================
                DEFECT TRENDS
            ================================== */}

            <div className="panel chart-panel">

              <h2>
                Defect Trends
              </h2>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <LineChart
                  data={defectTrendsData}
                >

                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: "#6b5b5b",
                    }}
                  />

                  <YAxis
                    tick={{
                      fill: "#6b5b5b",
                    }}
                  />

                  <Tooltip />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Defects Created"
                    stroke="#8f3f55"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

            {/* =================================
                AI INSIGHTS
            ================================== */}

            <div className="panel ai-insights-panel">

              <div className="ai-insights-header">

                <h2>
                  🤖 AI Analytics Insights
                </h2>

                <button
                  className="generate-ai-btn"
                  onClick={
                    handleGenerateAIInsights
                  }
                  disabled={aiLoading}
                >
                  {aiLoading
                    ? "Generating Report..."
                    : "Generate AI Report"}
                </button>

              </div>

              {aiError && (
                <p className="ai-error">
                  {aiError}
                </p>
              )}

              {aiInsights.length === 0 ? (

                <div className="empty-state">

                  <p>
                    No AI insights available yet.
                  </p>

                </div>

              ) : (

                <div className="ai-insights-list">

                  {aiInsights.map(
                    (insight, index) => (

                      <div
                        className={`ai-insight-card ${
                          insight.type || ""
                        }`}
                        key={index}
                      >

                        <h3>
                          {insight.title}
                        </h3>

                        <p>
                          {insight.message}
                        </p>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

            {/* =================================
                AVERAGE RESOLUTION TIME
            ================================== */}

            <div className="stat-card">

              <div className="stat-row">

                <div>

                  <p>
                    Avg Resolution Time
                  </p>

                  <h2>
                    {averageResolutionTime} hrs
                  </h2>

                </div>

                <div className="stat-icon">
                  ⏱
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}