import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateIssueForm() {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [priority, setPriority] = useState("Medium");

  // Milestone 2
  const [severity, setSeverity] = useState("Medium");
  const [category, setCategory] = useState("Other");

  const [report, setReport] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  // ==========================================
  // LOAD LOGGED-IN USER'S PROJECTS
  // ==========================================

  useEffect(() => {
    const fetchProjects = async () => {
      if (!token) {
        navigate("/login", {
          replace: true,
        });
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:5000/api/projects",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProjects(
          Array.isArray(res.data) ? res.data : []
        );
      } catch (err) {
        console.error(
          "Failed to load projects:",
          err
        );

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login", {
            replace: true,
          });
        }
      }
    };

    fetchProjects();
  }, [token, navigate]);

  // ==========================================
  // CLEAR OLD AI REPORT WHEN FORM CHANGES
  // ==========================================

  const clearReport = () => {
    if (report) {
      setReport("");
    }
  };

  // ==========================================
  // GENERATE AI REPORT
  // ==========================================

  const generateReport = async () => {
    if (!token) {
      alert("Please login again.");
      navigate("/login");
      return;
    }

    if (!project) {
      alert("Please select a project.");
      return;
    }

    if (!title.trim()) {
      alert("Please enter an issue title.");
      return;
    }

    if (!description.trim()) {
      alert("Please describe the bug.");
      return;
    }

    const selectedProject = projects.find(
      (item) => item._id === project
    );

    if (!selectedProject) {
      alert(
        "Selected project could not be found."
      );
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/ai/generate-bug-report",
        {
          title: title.trim(),
          description: description.trim(),

          priority,
          severity,
          category,

          projectName:
            selectedProject.projectName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.data?.report) {
        throw new Error(
          "AI did not return a report"
        );
      }

      setReport(res.data.report);
    } catch (err) {
      console.error(
        "AI report error:",
        err
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", {
          replace: true,
        });

        return;
      }

      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to generate AI report"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SAVE ISSUE
  // ==========================================

  const saveIssue = async () => {
    if (!token) {
      alert("Please login again.");
      navigate("/login");
      return;
    }

    if (!report) {
      alert(
        "Generate the AI report before saving."
      );
      return;
    }

    if (
      !project ||
      !title.trim() ||
      !description.trim()
    ) {
      alert(
        "Project, title and description are required."
      );
      return;
    }

    try {
      setSaving(true);

      await axios.post(
        "http://localhost:5000/api/issues/save",
        {
          title: title.trim(),
          description: description.trim(),

          priority,
          severity,
          category,

          project,
          report,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        "Issue Saved Successfully!"
      );

      // Reset form
      setProject("");
      setTitle("");
      setDescription("");

      setPriority("Medium");
      setSeverity("Medium");
      setCategory("Other");

      setReport("");

      // Go to Kanban board
      navigate("/issues");
    } catch (err) {
      console.error(
        "Save issue error:",
        err
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", {
          replace: true,
        });

        return;
      }

      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to save issue"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "35px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* PAGE HEADER */}

        <div
          style={{
            marginBottom: "30px",
          }}
        >
          <h1
            style={{
              marginBottom: "8px",
              color: "#2f2527",
            }}
          >
            Create New Issue
          </h1>

          <p
            style={{
              color: "#75676a",
              margin: 0,
            }}
          >
            Report a bug and generate a
            structured analysis for your team.
          </p>
        </div>

        {/* FORM CARD */}

        <div
          style={{
            background: "#fffaf8",
            padding: "30px",
            borderRadius: "18px",
            border: "1px solid #eadbd6",
            boxShadow:
              "0 8px 25px rgba(75, 45, 52, 0.08)",
          }}
        >
          {/* PROJECT */}

          <label style={labelStyle}>
            Project
          </label>

          <select
            value={project}
            onChange={(e) => {
              setProject(e.target.value);
              clearReport();
            }}
            style={inputStyle}
          >
            <option value="">
              Select a project
            </option>

            {projects.map((item) => (
              <option
                key={item._id}
                value={item._id}
              >
                {item.projectName}
              </option>
            ))}
          </select>

          {projects.length === 0 && (
            <p
              style={{
                color: "#8f3048",
                marginTop: "-10px",
                marginBottom: "20px",
              }}
            >
              You don't have any projects yet.
              Create a project before creating
              an issue.
            </p>
          )}

          {/* TITLE */}

          <label style={labelStyle}>
            Issue Title
          </label>

          <input
            type="text"
            placeholder="Example: Checkout page crashes"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              clearReport();
            }}
            style={inputStyle}
          />

          {/* DESCRIPTION */}

          <label style={labelStyle}>
            Bug Description
          </label>

          <textarea
            rows="7"
            placeholder="Describe what happened, what you expected, and the steps that caused the issue..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              clearReport();
            }}
            style={{
              ...inputStyle,
              resize: "vertical",
              minHeight: "150px",
            }}
          />

          {/* PRIORITY + SEVERITY */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
            }}
          >
            <div>
              <label style={labelStyle}>
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value);
                  clearReport();
                }}
                style={inputStyle}
              >
                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

                <option value="Critical">
                  Critical
                </option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>
                Severity
              </label>

              <select
                value={severity}
                onChange={(e) => {
                  setSeverity(e.target.value);
                  clearReport();
                }}
                style={inputStyle}
              >
                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

                <option value="Critical">
                  Critical
                </option>
              </select>
            </div>
          </div>

          {/* CATEGORY */}

          <label style={labelStyle}>
            Category
          </label>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              clearReport();
            }}
            style={inputStyle}
          >
            <option value="Other">
              Other
            </option>

            <option value="UI">
              UI
            </option>

            <option value="Authentication">
              Authentication
            </option>

            <option value="Backend">
              Backend
            </option>

            <option value="Database">
              Database
            </option>

            <option value="API">
              API
            </option>

            <option value="Performance">
              Performance
            </option>

            <option value="Security">
              Security
            </option>

            <option value="Navigation">
              Navigation
            </option>

            <option value="Checkout">
              Checkout
            </option>
          </select>

          {/* INFORMATION BOX */}

          <div
            style={{
              background: "#f8eeeb",
              border: "1px solid #eadbd6",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "22px",
              color: "#654f54",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            <strong>Priority</strong> tells the
            team how urgently the issue should
            be handled, while{" "}
            <strong>Severity</strong> describes
            how strongly the bug affects the
            application.
          </div>

          {/* GENERATE REPORT */}

          <button
            type="button"
            onClick={generateReport}
            disabled={
              loading ||
              saving ||
              projects.length === 0
            }
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "10px",

              background:
                loading ||
                saving ||
                projects.length === 0
                  ? "#c7aeb5"
                  : "linear-gradient(135deg, #702f43, #91465d)",

              color: "white",
              fontSize: "16px",
              fontWeight: "600",

              cursor:
                loading ||
                saving ||
                projects.length === 0
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {loading
              ? "Generating AI Report..."
              : "✦ Generate AI Report"}
          </button>

          {/* AI REPORT */}

          {report && (
            <div
              style={{
                marginTop: "30px",
                background: "#fdf5f3",
                border: "1px solid #eadbd6",
                padding: "25px",
                borderRadius: "14px",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  color: "#702f43",
                }}
              >
                AI Analysis
              </h2>

              <div
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.7",
                  color: "#45383b",
                }}
              >
                {report}
              </div>

              {/* SAVE */}

              <button
                type="button"
                onClick={saveIssue}
                disabled={saving || loading}
                style={{
                  marginTop: "25px",
                  width: "100%",
                  padding: "14px",
                  border: "none",
                  borderRadius: "10px",

                  background:
                    saving || loading
                      ? "#b9a6aa"
                      : "#702f43",

                  color: "white",
                  fontSize: "16px",
                  fontWeight: "600",

                  cursor:
                    saving || loading
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {saving
                  ? "Saving Issue..."
                  : "Save Issue"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// REUSABLE INLINE STYLES
// ==========================================

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
  color: "#4b3b3f",
};

const inputStyle = {
  width: "100%",
  padding: "13px",
  marginBottom: "22px",
  border: "1px solid #d8c7c3",
  borderRadius: "9px",
  boxSizing: "border-box",
  fontSize: "15px",
  background: "#ffffff",
  color: "#352b2d",
  outline: "none",
};