import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { analyzeBug } from "../services/issueService";

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

  // Milestone 2 - AI Triage
  const [severity, setSeverity] = useState("Medium");
  const [category, setCategory] = useState("Other");
// AI Classification
const [defectType, setDefectType] = useState("Other");
const [affectedModule, setAffectedModule] = useState("");
  const [report, setReport] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [triaging, setTriaging] = useState(false);

  // ==========================================
  // SIMILAR DEFECT DETECTION
  // ==========================================

  const [similarIssues, setSimilarIssues] = useState([]);
  const [showSimilarPopup, setShowSimilarPopup] = useState(false);

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
  // CLEAR OLD AI REPORT
  // ==========================================

  const clearReport = () => {
    if (report) {
      setReport("");
    }
  };

  // ==========================================
  // GENERATE AI REPORT + AI TRIAGE
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
      setTriaging(true);

      // ========================================
      // STEP 1: AI TRIAGE
      // ========================================

      const triageResult = await analyzeBug(
        description.trim()
      );

      console.log(
        "AI Triage Result:",
        triageResult
      );

      const detectedCategory =
  triageResult?.analysis?.category ||
  "Other";

const detectedSeverity =
  triageResult?.analysis?.severity ||
  "Medium";

const detectedPriority =
  triageResult?.analysis?.priority ||
  "Medium";

const detectedDefectType =
  triageResult?.analysis?.defectType ||
  "Other";

const detectedModule =
  triageResult?.analysis?.affectedModule ||
  "";

      // ========================================
      // STEP 2: UPDATE FORM VALUES
      // ========================================

      setCategory(detectedCategory);
setSeverity(detectedSeverity);
setPriority(detectedPriority);
setDefectType(detectedDefectType);
setAffectedModule(detectedModule);

      console.log(
        "Detected Category:",
        detectedCategory
      );

      console.log(
        "Detected Severity:",
        detectedSeverity
      );

      setTriaging(false);

      // ========================================
      // STEP 3: GENERATE FULL AI BUG REPORT
      // ========================================

      const res = await axios.post(
        "http://localhost:5000/api/ai/generate-bug-report",
        {
          title: title.trim(),
          description: description.trim(),
          priority: detectedPriority,
severity: detectedSeverity,
category: detectedCategory,

defectType: detectedDefectType,
affectedModule: detectedModule,

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

      alert(
  `AI Triage Complete!\n\n` +
  `Category: ${detectedCategory}\n` +
  `Severity: ${detectedSeverity}\n` +
  `Priority: ${detectedPriority}\n` +
  `Defect Type: ${detectedDefectType}\n` +
  `Affected Module: ${detectedModule || "Not identified"}`
);
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
          err.message ||
          "Failed to generate AI report"
      );
    } finally {
      setLoading(false);
      setTriaging(false);
    }
  };

  // ==========================================
  // SAVE ISSUE
  // ==========================================

  const saveIssue = async (
    skipDuplicateCheck = false
  ) => {
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

      // ========================================
      // CREATE ISSUE
      // ========================================

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
          defectType,
affectedModule,

          // ====================================
          // DUPLICATE OVERRIDE
          // ====================================
          // false = perform duplicate detection
          // true  = user already reviewed duplicates
          //        and wants to continue
          skipDuplicateCheck,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ========================================
      // SUCCESS
      // ========================================

      alert(
        skipDuplicateCheck
          ? "Issue Created Successfully!"
          : "Issue Saved Successfully!"
      );

      // Close popup if open
      setShowSimilarPopup(false);
      setSimilarIssues([]);

      // Reset form
      setProject("");
      setTitle("");
      setDescription("");

      setPriority("Medium");
      setSeverity("Medium");
      setCategory("Other");
      setDefectType("Other");
setAffectedModule("");

      setReport("");
      

      // Go to issues page
      navigate("/issues");
    } catch (err) {
      console.error(
        "Save issue error:",
        err
      );

      // ========================================
      // SIMILAR DEFECT DETECTED
      // ========================================

      if (
        err.response?.status === 409 &&
        err.response?.data?.duplicate
      ) {
        const matches =
          err.response?.data?.similarIssues || [];

        setSimilarIssues(matches);
        setShowSimilarPopup(true);

        return;
      }

      // ========================================
      // AUTHENTICATION ERROR
      // ========================================

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", {
          replace: true,
        });

        return;
      }

      // ========================================
      // OTHER ERRORS
      // ========================================

      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to save issue"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // CONTINUE ANYWAY
  // ==========================================

  const saveIssueWithoutDuplicateCheck = () => {
    setShowSimilarPopup(false);

    // Give the popup a moment to close,
    // then create the issue while telling
    // the backend that duplicates were already
    // reviewed by the user.
    setTimeout(() => {
      saveIssue(true);
    }, 100);
  };

  // ==========================================
  // VIEW EXISTING ISSUE
  // ==========================================

  const viewExistingIssues = () => {
    setShowSimilarPopup(false);

    // Your existing Issues page is the safe
    // destination because the current project
    // already uses /issues.
    navigate("/issues");
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

          {/* AI TRIAGE INFORMATION */}

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
            <strong>AI Triage:</strong>{" "}
            When you generate the report, Gemini
            will automatically analyze the bug
            description and suggest the appropriate
            category and severity.
          </div>

          {/* ==========================================
    AI DETECTED VALUES
========================================== */}

{(triaging || report) && (
  <div
    style={{
      background: "#fdf5f3",
      border: "1px solid #eadbd6",
      borderRadius: "10px",
      padding: "18px",
      marginBottom: "22px",
    }}
  >
    <strong
      style={{
        color: "#702f43",
        fontSize: "16px",
      }}
    >
      🤖 AI Defect Classification
    </strong>

    {triaging ? (
      <p
        style={{
          marginBottom: 0,
          marginTop: "10px",
          color: "#75676a",
        }}
      >
        AI is analyzing the defect...
      </p>
    ) : (
      <div
        style={{
          marginTop: "14px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
        }}
      >
        {/* CATEGORY */}
        <div
          style={{
            padding: "12px",
            background: "#eadbd6",
            borderRadius: "9px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#8b777d",
              fontWeight: "700",
              marginBottom: "4px",
              textTransform: "uppercase",
            }}
          >
            Category
          </div>

          <div
            style={{
              color: "#702f43",
              fontWeight: "700",
            }}
          >
            {category}
          </div>
        </div>

        {/* SEVERITY */}
        <div
          style={{
            padding: "12px",
            background: "#eadbd6",
            borderRadius: "9px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#8b777d",
              fontWeight: "700",
              marginBottom: "4px",
              textTransform: "uppercase",
            }}
          >
            Severity
          </div>

          <div
            style={{
              color: "#702f43",
              fontWeight: "700",
            }}
          >
            {severity}
          </div>
        </div>

        {/* PRIORITY */}
        <div
          style={{
            padding: "12px",
            background: "#eadbd6",
            borderRadius: "9px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#8b777d",
              fontWeight: "700",
              marginBottom: "4px",
              textTransform: "uppercase",
            }}
          >
            Priority
          </div>

          <div
            style={{
              color: "#702f43",
              fontWeight: "700",
            }}
          >
            {priority}
          </div>
        </div>

        {/* DEFECT TYPE */}
        <div
          style={{
            padding: "12px",
            background: "#eadbd6",
            borderRadius: "9px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#8b777d",
              fontWeight: "700",
              marginBottom: "4px",
              textTransform: "uppercase",
            }}
          >
            Defect Type
          </div>

          <div
            style={{
              color: "#702f43",
              fontWeight: "700",
            }}
          >
            {defectType}
          </div>
        </div>

        {/* AFFECTED MODULE */}
        <div
          style={{
            padding: "12px",
            background: "#eadbd6",
            borderRadius: "9px",
            gridColumn: "1 / -1",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#8b777d",
              fontWeight: "700",
              marginBottom: "4px",
              textTransform: "uppercase",
            }}
          >
            Affected Module
          </div>

          <div
            style={{
              color: "#702f43",
              fontWeight: "700",
            }}
          >
            {affectedModule || "Not specified"}
          </div>
        </div>
      </div>
    )}

    {!triaging && report && (
      <p
        style={{
          margin: "14px 0 0",
          fontSize: "12px",
          color: "#75676a",
        }}
      >
        💡 These classifications were suggested by AI and
        can be reviewed before saving the defect.
      </p>
    )}
  </div>
)}           
         
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
              ? triaging
                ? "Analyzing Bug..."
                : "Generating AI Report..."
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
                onClick={() => saveIssue(false)}
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

      {/* ==========================================
          SIMILAR DEFECT POPUP
      ========================================== */}

      {showSimilarPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0, 0, 0, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() =>
            setShowSimilarPopup(false)
          }
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              width: "100%",
              maxWidth: "680px",
              maxHeight: "85vh",
              overflowY: "auto",
              background: "#fffaf8",
              borderRadius: "18px",
              padding: "28px",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.25)",
              border: "1px solid #eadbd6",
            }}
          >
            {/* POPUP HEADER */}

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "flex-start",
                gap: "15px",
                marginBottom: "20px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    color: "#702f43",
                    fontSize: "22px",
                  }}
                >
                  ⚠️ Similar Defect Detected
                </h2>

                <p
                  style={{
                    margin: "7px 0 0",
                    color: "#75676a",
                    fontSize: "13px",
                    lineHeight: "1.5",
                  }}
                >
                  Our AI found existing defects
                  that may be related to the
                  issue you are trying to create.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowSimilarPopup(false)
                }
                style={{
                  width: "34px",
                  height: "34px",
                  border: "none",
                  borderRadius: "50%",
                  background: "#f1e5e1",
                  color: "#702f43",
                  fontSize: "22px",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>

            {/* CURRENT ISSUE */}

            <div
              style={{
                padding: "14px",
                background: "#f8eeeb",
                border:
                  "1px solid #eadbd6",
                borderRadius: "10px",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  color: "#8b777d",
                  textTransform:
                    "uppercase",
                  marginBottom: "6px",
                }}
              >
                New Issue
              </div>

              <div
                style={{
                  color: "#4b3b3f",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {title}
              </div>

              <div
                style={{
                  marginTop: "6px",
                  color: "#75676a",
                  fontSize: "12px",
                  lineHeight: "1.5",
                }}
              >
                {description}
              </div>
            </div>

            {/* SIMILAR ISSUES */}

            <div
              style={{
                marginBottom: "10px",
                color: "#702f43",
                fontSize: "12px",
                fontWeight: "700",
                textTransform:
                  "uppercase",
              }}
            >
              Similar Existing Defects
            </div>

            {similarIssues.length === 0 ? (
              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#75676a",
                  background: "#fdf5f3",
                  borderRadius: "10px",
                }}
              >
                No similar issue details
                available.
              </div>
            ) : (
              similarIssues.map(
                (issue, index) => (
                  <div
                    key={
                      issue.issueId ||
                      index
                    }
                    style={{
                      background:
                        "#fdf5f3",
                      border:
                        "1px solid #eadbd6",
                      borderRadius: "12px",
                      padding: "16px",
                      marginBottom: "12px",
                    }}
                  >
                    {/* ISSUE HEADER */}

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          minWidth: 0,
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            color:
                              "#4b3b3f",
                            fontSize:
                              "15px",
                          }}
                        >
                          {issue.title ||
                            "Untitled Issue"}
                        </h3>

                        <p
                          style={{
                            margin:
                              "7px 0 0",
                            color:
                              "#75676a",
                            fontSize:
                              "12px",
                            lineHeight:
                              "1.5",
                          }}
                        >
                          {issue.description ||
                            "No description available."}
                        </p>
                      </div>

                      <span
                        style={{
                          background:
                            "#eadbd6",
                          color:
                            "#702f43",
                          padding:
                            "6px 10px",
                          borderRadius:
                            "20px",
                          fontWeight:
                            "700",
                          fontSize:
                            "11px",
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {issue.similarityPercentage ??
                          Math.round(
                            (issue.similarity ||
                              0) * 100
                          )}
                        % similar
                      </span>
                    </div>

                    {/* ISSUE DETAILS */}

                    <div
                      style={{
                        display:
                          "flex",
                        gap: "7px",
                        flexWrap:
                          "wrap",
                        marginTop:
                          "12px",
                      }}
                    >
                      {issue.status && (
                        <span
                          style={
                            similarTagStyle
                          }
                        >
                          {issue.status}
                        </span>
                      )}

                      {issue.priority && (
                        <span
                          style={
                            similarTagStyle
                          }
                        >
                          Priority:{" "}
                          {issue.priority}
                        </span>
                      )}

                      {issue.severity && (
                        <span
                          style={
                            similarTagStyle
                          }
                        >
                          Severity:{" "}
                          {issue.severity}
                        </span>
                      )}

                      {issue.category && (
                        <span
                          style={
                            similarTagStyle
                          }
                        >
                          {issue.category}
                        </span>
                      )}
                    </div>

                    {/* VIEW EXISTING ISSUE */}

                    <button
                      type="button"
                      onClick={
                        viewExistingIssues
                      }
                      style={{
                        marginTop:
                          "12px",
                        width: "100%",
                        padding:
                          "9px",
                        border:
                          "1px solid #702f43",
                        borderRadius:
                          "8px",
                        background:
                          "#fffaf8",
                        color:
                          "#702f43",
                        cursor:
                          "pointer",
                        fontWeight:
                          "600",
                        fontSize:
                          "12px",
                      }}
                    >
                      🔎 View Existing Issues
                    </button>
                    
                  </div>
                )
              )
            )}

            {/* INFORMATION */}

            <div
              style={{
                marginTop: "18px",
                padding: "13px",
                background:
                  "#fff8e8",
                border:
                  "1px solid #ead9a7",
                borderRadius: "10px",
                color: "#75632d",
                fontSize: "12px",
                lineHeight: "1.6",
              }}
            >
              <strong>
                💡 Why am I seeing this?
              </strong>

              <br />

              The system compares the meaning
              of your defect description with
              previously reported defects using
              semantic AI similarity.
            </div>

            {/* POPUP ACTIONS */}

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setShowSimilarPopup(false)
                }
                style={{
                  flex: 1,
                  padding: "12px",
                  border:
                    "1px solid #702f43",
                  borderRadius: "9px",
                  background:
                    "#fffaf8",
                  color: "#702f43",
                  cursor:
                    "pointer",
                  fontWeight:
                    "600",
                  fontSize: "13px",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  saveIssueWithoutDuplicateCheck
                }
                disabled={saving}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "none",
                  borderRadius: "9px",
                  background:
                    saving
                      ? "#b9a6aa"
                      : "#702f43",
                  color: "#ffffff",
                  cursor:
                    saving
                      ? "not-allowed"
                      : "pointer",
                  fontWeight:
                    "600",
                  fontSize: "13px",
                }}
              >
                {saving
                  ? "Creating..."
                  : "Continue Anyway"}
              </button>
            </div>
          </div>
        </div>
      )}
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

const similarTagStyle = {
  display: "inline-block",
  padding: "5px 9px",
  borderRadius: "15px",
  background: "#eadbd6",
  color: "#702f43",
  fontSize: "10px",
  fontWeight: "600",
};
