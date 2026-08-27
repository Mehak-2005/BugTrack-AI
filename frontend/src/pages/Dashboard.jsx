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

  const [projects, setProjects] = useState([]);
const [issues, setIssues] = useState([]);
const [analytics, setAnalytics] = useState(null);
const [loading, setLoading] = useState(true);

const [aiInsights, setAiInsights] = useState([]);
const [aiLoading, setAiLoading] = useState(false);
const [aiError, setAiError] = useState("");
  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    const loadDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const [
          projectsResponse,
          issuesResponse,
          analyticsResponse,
        ] = await Promise.all([
          axios.get(
            "http://localhost:5000/api/projects",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          axios.get(
            "http://localhost:5000/api/issues",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          axios.get(
             "http://localhost:5000/api/analytics/dashboard",
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

        console.log(
          "Analytics:",
          analyticsResponse.data
        );
        console.log(
  "Status Data:",
  analyticsResponse.data?.defectsByStatus
);

console.log(
  "Severity Data:",
  analyticsResponse.data?.defectsBySeverity
);

console.log(
  "Category Data:",
  analyticsResponse.data?.defectsByCategory
);
console.log("Developer Workload:", analyticsResponse.data.developerWorkload);
console.log(
  "Defect Trends:",
  analyticsResponse.data.defectTrends
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

        setAnalytics(analyticsResponse.data);
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

    loadDashboard();
  }, [navigate]);

  // ==========================================
  // DASHBOARD STATISTICS
  // ==========================================

  const totalProjects = projects.length;

const totalIssues = analytics?.summary?.totalDefects ?? 0;

const openIssues = analytics?.summary?.openDefects ?? 0;

const inProgressIssues =
  analytics?.summary?.inProgressDefects ?? 0;

const inReviewIssues =
  analytics?.summary?.inReviewDefects ?? 0;

const resolvedIssues =
  analytics?.summary?.resolvedDefects ?? 0;
  const averageResolutionTime =
  analytics?.summary?.averageResolutionTime ?? 0;
    // ==========================================
// CHART DATA
// ==========================================

const statusChartData = analytics?.defectsByStatus || [];
const severityChartData = analytics?.defectsBySeverity || [];
const categoryChartData = analytics?.defectsByCategory || [];
const developerWorkloadData = Array.isArray(analytics?.developerWorkload)
  ? analytics.developerWorkload
  : [];
  const defectTrendsData = Array.isArray(analytics?.defectTrends)
  ? analytics.defectTrends
  : [];
  const dashboardAIInsights = Array.isArray(analytics?.aiInsights)
  ? analytics.aiInsights
  : [];
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
  // ==========================================
// GENERATE AI ANALYTICS INSIGHTS
// ==========================================
  const handleGenerateAIInsights  = async () => {
  try {
    setAiLoading(true);
    setAiError("");
    setAiInsights([]);

    const token = localStorage.getItem("token");

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
        data.message || "Failed to generate AI analytics insights"
      );
    }

    setAiInsights(data.aiInsights || []);
  } catch (error) {
    console.error("AI Insights Error:", error);
    setAiError(
      error.message || "Failed to generate AI analytics insights"
    );
  } finally {
    setAiLoading(false);
  }
};
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
    {/* =====================================
    ADVANCED ANALYTICS
===================================== */}

<div className="analytics-section">
  <h2 className="analytics-title">
    Advanced Analytics
  </h2>

  <div className="analytics-grid">

    {/* DEFECTS BY STATUS */}
    <div className="panel chart-panel">
      <h2>Defects by Status</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={statusChartData}>
          <XAxis
            dataKey="name"
            tick={{ fill: "#6b5b5b" }}
          />

          <YAxis
            tick={{ fill: "#6b5b5b" }}
          />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="value"
            name="Issues"
            fill="#8f3f55"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>


    {/* DEFECTS BY SEVERITY */}
    <div className="panel chart-panel">
      <h2>Defects by Severity</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={severityChartData}>
          <XAxis
            dataKey="name"
            tick={{ fill: "#6b5b5b" }}
          />

          <YAxis
            tick={{ fill: "#6b5b5b" }}
          />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="value"
            name="Issues"
            radius={[8, 8, 0, 0]}
          >
            {severityChartData.map((entry, index) => {
              const colors = [
                "#b84c4c",
                "#9b3552",
                "#d49a4f",
                "#7c9a6d",
              ];

              return (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* DEFECTS BY CATEGORY */}
    <div className="panel chart-panel">
      <h2>Defects by Category</h2>

      <ResponsiveContainer width="100%" height={320}>
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
            {categoryChartData.map((entry, index) => {
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
                  fill={colors[index % colors.length]}
                />
              );
            })}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
    {/* DEVELOPER WORKLOAD */}

<div className="panel chart-panel">
  <h2>Developer Workload</h2>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={developerWorkloadData}>
      
      <XAxis
        dataKey="name"
        tick={{ fill: "#6b5b5b" }}
      />

      <YAxis
        tick={{ fill: "#6b5b5b" }}
      />

      <Tooltip />

      <Legend />

      <Bar
        dataKey="value"
        name="Assigned Issues"
        fill="#8f3f55"
        radius={[8, 8, 0, 0]}
      />

    </BarChart>
  </ResponsiveContainer>
</div>
{/* DEFECT TRENDS */}

<div className="panel chart-panel">
  <h2>Defect Trends</h2>

  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={defectTrendsData}>
      
      <XAxis
        dataKey="name"
        tick={{ fill: "#6b5b5b" }}
      />

      <YAxis
        tick={{ fill: "#6b5b5b" }}
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
{/* AI INSIGHTS */}

<div className="panel ai-insights-panel">

  <div className="ai-insights-header">
    <h2>🤖 AI Analytics Insights</h2>

    <button
  className="generate-ai-btn"
  onClick={handleGenerateAIInsights}
  disabled={aiLoading}
>
  {aiLoading ? "Generating Report..." : "Generate AI Report"}
</button>
{aiError && (
  <p className="ai-error">
    {aiError}
  </p>
)}
  </div>

  {aiError && (
    <p className="ai-error">
      {aiError}
    </p>
  )}

  {aiInsights.length === 0 ? (

    <div className="empty-state">
      <p>No AI insights available yet.</p>
    </div>

  ) : (

    <div className="ai-insights-list">

      {aiInsights.map((insight, index) => (

        <div
          className={`ai-insight-card ${insight.type || ""}`}
          key={index}
        >

          <h3>{insight.title}</h3>

          <p>{insight.message}</p>

        </div>

      ))}

    </div>

  )}

</div>
{/* AVERAGE RESOLUTION TIME */}

<div className="stat-card">
  <div className="stat-row">
    <div>
      <p>Avg Resolution Time</p>

      <h2>{averageResolutionTime} hrs</h2>
    </div>

    <div className="stat-icon">
      ⏱
    </div>
  </div>
</div>

  </div>
</div>
    </div>
  );
}