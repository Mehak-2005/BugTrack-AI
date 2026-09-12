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
import AuditReportModal from "../components/AuditReportModal";
import { generateAuditMarkdown } from "../services/auditExportService";

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

  // AI Defect Hotspots State
  const [hotspotData, setHotspotData] = useState(null);
  const [hotspotLoading, setHotspotLoading] = useState(false);

  // Audit Export State
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [auditMarkdown, setAuditMarkdown] = useState("");

  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================
  useEffect(() => {
    const loadDashboard = async () => {
      const token = localStorage.getItem("token");
      const loginType = localStorage.getItem("loginType");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        setLoading(true);

        if (loginType === "team-member") {
          setIsTeamMember(true);
          const response = await axios.get("http://localhost:5000/api/team/my-project", {
            headers: { Authorization: `Bearer ${token}` },
          });

          setTeamMember(response.data.teamMember || null);
          setMyProject(response.data.project || null);
          setIssues(Array.isArray(response.data.issues) ? response.data.issues : []);
          return;
        }

        // Normal user dashboard
        setIsTeamMember(false);

        // Fetch hotspots alongside dashboard metrics
        const fetchHotspots = async () => {
          try {
            setHotspotLoading(true);
            const res = await axios.get("http://localhost:5000/api/issues/analytics/hotspots", {
              headers: { Authorization: `Bearer ${token}` },
            });
            setHotspotData(res.data?.data || null);
          } catch (err) {
            console.error("Hotspots error:", err);
          } finally {
            setHotspotLoading(false);
          }
        };
        fetchHotspots();

        const [projectsResponse, issuesResponse, analyticsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/projects", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/issues", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/analytics/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProjects(Array.isArray(projectsResponse.data) ? projectsResponse.data : []);
        setIssues(Array.isArray(issuesResponse.data) ? issuesResponse.data : []);
        setAnalytics(analyticsResponse.data);
      } catch (error) {
        console.error("Dashboard loading error:", error);
        if (error.response?.status === 401) {
          localStorage.clear();
          navigate("/login", { replace: true });
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
  const totalProjects = isTeamMember ? (myProject ? 1 : 0) : projects.length;
  const totalIssues = isTeamMember ? issues.length : analytics?.summary?.totalDefects ?? 0;
  const openIssues = isTeamMember
    ? issues.filter((i) => i.status === "Open").length
    : analytics?.summary?.openDefects ?? 0;
  const inProgressIssues = isTeamMember
    ? issues.filter((i) => i.status === "In Progress").length
    : analytics?.summary?.inProgressDefects ?? 0;
  const inReviewIssues = isTeamMember
    ? issues.filter((i) => i.status === "In Review").length
    : analytics?.summary?.inReviewDefects ?? 0;
  const resolvedIssues = isTeamMember
    ? issues.filter((i) => i.status === "Resolved").length
    : analytics?.summary?.resolvedDefects ?? 0;
  const closedIssues = issues.filter((i) => i.status === "Closed").length;

  const averageResolutionTime = analytics?.summary?.averageResolutionTime ?? 0;

  // ==========================================
  // AUDIT REPORT HANDLER (Correctly Scoped)
  // ==========================================
  const handleOpenAuditReport = () => {
    const criticalDefects = issues.filter(
      (i) => (i.severity === "Critical" || i.priority === "Critical") && i.status !== "Closed"
    );

    const markdown = generateAuditMarkdown({
      stats: {
        total: totalIssues,
        open: openIssues,
        inProgress: inProgressIssues,
        inReview: inReviewIssues,
        resolved: resolvedIssues,
        closed: closedIssues,
        avgResolutionTime: averageResolutionTime,
      },
      hotspots: hotspotData,
      recentCriticalIssues: criticalDefects,
      projectsCount: totalProjects,
    });

    setAuditMarkdown(markdown);
    setAuditModalOpen(true);
  };

  // ==========================================
  // CHART DATA
  // ==========================================
  const statusChartData = analytics?.defectsByStatus || [];
  const severityChartData = analytics?.defectsBySeverity || [];
  const categoryChartData = analytics?.defectsByCategory || [];
  const developerWorkloadData = Array.isArray(analytics?.developerWorkload) ? analytics.developerWorkload : [];
  const defectTrendsData = Array.isArray(analytics?.defectTrends) ? analytics.defectTrends : [];

  const sortedIssues = [...issues].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const recentIssues = isTeamMember ? sortedIssues : sortedIssues.slice(0, 5);
  const recentProjects = [...projects].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);

  const handleGenerateAIInsights = async () => {
    try {
      setAiLoading(true);
      setAiError("");
      setAiInsights([]);
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/analytics/insights", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to generate AI analytics insights");
      setAiInsights(data.aiInsights || []);
    } catch (error) {
      console.error("AI Insights Error:", error);
      setAiError(error.message || "Failed to generate AI analytics insights");
    } finally {
      setAiLoading(false);
    }
  };

  const getFragilityColor = (score) => {
    if (score >= 75) return "#dc2626";
    if (score >= 50) return "#d97706";
    if (score >= 25) return "#2563eb";
    return "#16a34a";
  };

  if (loading) {
    return <div style={{ padding: "40px", fontSize: "18px" }}>Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          {isTeamMember ? (
            <>
              <p className="dashboard-label">PROJECT OVERVIEW</p>
              <h1>{myProject?.projectName || "Dashboard"}</h1>
              <p>{myProject?.description || "View and manage issues assigned to your project."}</p>
            </>
          ) : (
            <>
              <h1>Dashboard</h1>
              <p>Welcome back! Here's what's happening with your workspace.</p>
            </>
          )}
        </div>

        {!isTeamMember && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              className="primary-btn"
              onClick={handleOpenAuditReport}
              style={{
                background: "#ffffff",
                color: "#702f43",
                border: "1px solid #d8c7c3",
                fontWeight: "600",
              }}
            >
              📄 Export QA Audit
            </button>
            <button className="primary-btn" onClick={() => navigate("/create-issue")}>
              + Create Issue
            </button>
          </div>
        )}
      </div>

      {/* TEAM MEMBER INFO */}
      {isTeamMember && teamMember && myProject && (
        <div className="team-member-project-card">
          <div className="team-member-project-info">
            <div className="team-avatar">{teamMember.name?.charAt(0).toUpperCase()}</div>
            <div>
              <h2>{teamMember.name}</h2>
              <p>{teamMember.role}</p>
              <span>{teamMember.email}</span>
            </div>
          </div>
          <div className="team-member-details">
            <div>
              <strong>Project</strong>
              <span>{myProject.projectName}</span>
            </div>
            <div>
              <strong>Experience</strong>
              <span>{teamMember.experience || 0} years</span>
            </div>
            <div>
              <strong>Workload</strong>
              <span>{teamMember.workload || 0}%</span>
            </div>
          </div>
        </div>
      )}

      {/* STATS CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-row">
            <div>
              <p>{isTeamMember ? "Assigned Project" : "Total Projects"}</p>
              <h2>{totalProjects}</h2>
            </div>
            <div className="stat-icon">◫</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-row">
            <div>
              <p>{isTeamMember ? "Project Issues" : "Total Issues"}</p>
              <h2>{totalIssues}</h2>
            </div>
            <div className="stat-icon">◉</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-row">
            <div>
              <p>Open Issues</p>
              <h2>{openIssues}</h2>
            </div>
            <div className="stat-icon">!</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-row">
            <div>
              <p>In Progress</p>
              <h2>{inProgressIssues}</h2>
            </div>
            <div className="stat-icon">↻</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-row">
            <div>
              <p>In Review</p>
              <h2>{inReviewIssues}</h2>
            </div>
            <div className="stat-icon">◎</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-row">
            <div>
              <p>Resolved</p>
              <h2>{resolvedIssues}</h2>
            </div>
            <div className="stat-icon">✓</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-row">
            <div>
              <p>Closed</p>
              <h2>{closedIssues}</h2>
            </div>
            <div className="stat-icon">✓</div>
          </div>
        </div>
      </div>

      {/* LOWER DASHBOARD */}
      <div className="dashboard-grid">
        {/* RECENT ISSUES */}
        <div className="panel">
          <div className="panel-header">
            <h2>{isTeamMember ? "Project Issues" : "Recent Issues"}</h2>
            <button className="primary-btn" onClick={() => navigate("/issues")}>
              View All
            </button>
          </div>

          {recentIssues.length === 0 ? (
            <div className="empty-state">
              <h3>No issues yet</h3>
              <p>
                {isTeamMember
                  ? "No issues have been assigned to this project yet."
                  : "Create your first issue to start tracking bugs."}
              </p>
            </div>
          ) : (
            recentIssues.map((issue) => (
              <div className="issue-row" key={issue._id}>
                <h4>{issue.title || issue.description || "Untitled Issue"}</h4>
                <p>
                  {issue.status || "Open"} • {issue.priority || "Medium"}
                </p>
              </div>
            ))
          )}
        </div>

        {/* PROJECTS */}
        <div className="panel">
          <div className="panel-header">
            <h2>{isTeamMember ? "Assigned Project" : "Your Projects"}</h2>
            <button className="primary-btn" onClick={() => navigate("/projects")}>
              View All
            </button>
          </div>

          {isTeamMember ? (
            myProject ? (
              <div className="project-mini-card">
                <h4>{myProject.projectName}</h4>
                <p>{myProject.description || "No project description available."}</p>
                <p>
                  <strong>Access:</strong> Team Member
                </p>
              </div>
            ) : (
              <div className="empty-state">
                <h3>No project assigned</h3>
                <p>You currently don't have a project assigned.</p>
              </div>
            )
          ) : recentProjects.length === 0 ? (
            <div className="empty-state">
              <h3>No projects yet</h3>
              <p>Create your first project to organize your issues.</p>
              <button className="primary-btn" onClick={() => navigate("/projects")}>
                + Create Project
              </button>
            </div>
          ) : (
            recentProjects.map((project) => (
              <div className="project-mini-card" key={project._id}>
                <h4>{project.projectName}</h4>
                <p>{project.description || "No description"}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ADVANCED ANALYTICS */}
      {!isTeamMember && (
        <div className="analytics-section">
          <h2 className="analytics-title">Advanced Analytics</h2>

          {/* AI DEFECT HOTSPOTS & FRAGILITY HEATMAP */}
          <div
            style={{
              background: "#fffaf8",
              border: "1px solid #eadbd6",
              borderRadius: "18px",
              padding: "24px",
              marginBottom: "25px",
              boxShadow: "0 8px 25px rgba(75, 45, 52, 0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    color: "#702f43",
                    fontSize: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  🔥 AI Defect Hotspot Heatmap & Module Fragility
                </h2>
                <p style={{ margin: "4px 0 0", color: "#75676a", fontSize: "13px" }}>
                  Identifies codebase vulnerability concentration weighted by defect severity.
                </p>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  background: "#f4e2e5",
                  color: "#702f43",
                  padding: "5px 12px",
                  borderRadius: "14px",
                  fontWeight: 700,
                }}
              >
                {hotspotData?.totalAnalyzed ?? 0} Defects Analyzed
              </span>
            </div>

            {hotspotLoading ? (
              <p style={{ color: "#75676a", textAlign: "center", padding: "20px" }}>
                Calculating module fragility index...
              </p>
            ) : hotspotData?.fragileModules?.length > 0 ? (
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "14px",
                    marginBottom: "20px",
                  }}
                >
                  {hotspotData.fragileModules.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #f0e4e1",
                        borderRadius: "12px",
                        padding: "14px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "6px",
                        }}
                      >
                        <span style={{ fontWeight: 700, color: "#352b2d", fontSize: "14px" }}>
                          {item.name}
                        </span>
                        <span
                          style={{
                            fontWeight: 800,
                            color: getFragilityColor(item.fragilityScore),
                            fontSize: "15px",
                          }}
                        >
                          {item.fragilityScore}%
                        </span>
                      </div>

                      <div style={{ fontSize: "12px", color: "#8a757a", marginBottom: "8px" }}>
                        {item.defectCount} issues • {item.criticalCount} Critical/High
                      </div>

                      <div
                        style={{
                          width: "100%",
                          height: "7px",
                          background: "#f3e7e4",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${item.fragilityScore}%`,
                            height: "100%",
                            background: getFragilityColor(item.fragilityScore),
                            borderRadius: "4px",
                            transition: "width 0.4s ease",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {hotspotData?.aiInsight && (
                  <div
                    style={{
                      background: "linear-gradient(135deg, #fdf5f3 0%, #faece9 100%)",
                      border: "1px solid #ecd8d3",
                      borderRadius: "12px",
                      padding: "16px 20px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#702f43",
                        fontSize: "13px",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                      }}
                    >
                      🧠 Architectural Technical Debt Assessment
                    </div>
                    <p style={{ margin: "0 0 8px", color: "#45383b", fontSize: "13.5px", lineHeight: "1.5" }}>
                      {hotspotData.aiInsight.architecturalRisk}
                    </p>
                    <div style={{ fontSize: "13px", color: "#166534", fontWeight: 600 }}>
                      💡 Recommended Action: {hotspotData.aiInsight.recommendedAction}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ color: "#75676a", textAlign: "center", padding: "15px" }}>
                No active defect hotspots detected. All application modules are currently stable.
              </p>
            )}
          </div>

          <div className="analytics-grid">
            {/* DEFECTS BY STATUS */}
            <div className="panel chart-panel">
              <h2>Defects by Status</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusChartData}>
                  <XAxis dataKey="name" tick={{ fill: "#6b5b5b" }} />
                  <YAxis tick={{ fill: "#6b5b5b" }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Issues" fill="#8f3f55" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* DEFECTS BY SEVERITY */}
            <div className="panel chart-panel">
              <h2>Defects by Severity</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={severityChartData}>
                  <XAxis dataKey="name" tick={{ fill: "#6b5b5b" }} />
                  <YAxis tick={{ fill: "#6b5b5b" }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Issues" radius={[8, 8, 0, 0]}>
                    {severityChartData.map((entry, index) => {
                      const colors = ["#b84c4c", "#9b3552", "#d49a4f", "#7c9a6d"];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
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
                      const colors = ["#8f3f55", "#b96a7c", "#d49a4f", "#7c9a6d", "#6f7ea8"];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
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
                  <XAxis dataKey="name" tick={{ fill: "#6b5b5b" }} />
                  <YAxis tick={{ fill: "#6b5b5b" }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Assigned Issues" fill="#8f3f55" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* DEFECT TRENDS */}
            <div className="panel chart-panel">
              <h2>Defect Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={defectTrendsData}>
                  <XAxis dataKey="name" tick={{ fill: "#6b5b5b" }} />
                  <YAxis tick={{ fill: "#6b5b5b" }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="Defects Created" stroke="#8f3f55" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* AI INSIGHTS */}
            <div className="panel ai-insights-panel">
              <div className="ai-insights-header">
                <h2>🤖 AI Analytics Insights</h2>
                <button className="generate-ai-btn" onClick={handleGenerateAIInsights} disabled={aiLoading}>
                  {aiLoading ? "Generating Report..." : "Generate AI Report"}
                </button>
              </div>

              {aiError && <p className="ai-error">{aiError}</p>}

              {aiInsights.length === 0 ? (
                <div className="empty-state">
                  <p>No AI insights available yet.</p>
                </div>
              ) : (
                <div className="ai-insights-list">
                  {aiInsights.map((insight, index) => (
                    <div className={`ai-insight-card ${insight.type || ""}`} key={index}>
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
                <div className="stat-icon">⏱</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT REPORT EXPORTER MODAL */}
      <AuditReportModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        markdownContent={auditMarkdown}
      />
    </div>
  );
}