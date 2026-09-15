import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedPasskey, setGeneratedPasskey] = useState("");

  const navigate = useNavigate();

  // ==============================
  // GET PROJECTS
  // ==============================

  const fetchProjects = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      navigate("/login");
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

      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");

        alert("Your login session is invalid. Please login again.");

        navigate("/login");
      }
    }
  };

  // ==============================
  // LOAD PROJECTS
  // ==============================

  useEffect(() => {
    fetchProjects();
  }, []);

  // ==============================
  // CREATE PROJECT
  // ==============================

  const createProject = async (e) => {
    e.preventDefault();

    if (!projectName.trim()) {
      alert("Please enter a project name");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setGeneratedPasskey("");

      const res = await axios.post(
        "http://localhost:5000/api/projects",
        {
          projectName,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setGeneratedPasskey(res.data.passkey);
        alert("Project Created Successfully!");

        // Clear form
        setProjectName("");
        setDescription("");

        // Reload projects
        await fetchProjects();
      }

    } catch (err) {
      console.error("Error creating project:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");

        alert("Your login session is invalid. Please login again.");

        navigate("/login");

        return;
      }

      alert(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to create project"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="projects-page">
      <h1>Projects</h1>

      {/* ==========================
          CREATE PROJECT FORM
      ========================== */}
      <div className="create-project-card">
     
        <h2>Create New Project</h2>

        <form onSubmit={createProject}>

          <input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) =>
              setProjectName(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              boxSizing: "border-box",
              fontSize: "16px",
            }}
          />

          <textarea
            placeholder="Project Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows="4"
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              boxSizing: "border-box",
              fontSize: "16px",
              resize: "vertical",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            className="primary-btn"
            style={{ width: "100%", padding: "12px", cursor: "pointer" }}
          >
            {loading ? "Creating..." : "Create Project"}
          </button>

        </form>

        {/* ==========================
            DISPLAY GENERATED PASSKEY
        ========================== */}
        {generatedPasskey && (
          <div style={{ background: "#eefbf3", border: "1px solid #16794c", padding: "16px", borderRadius: "10px", marginTop: "20px" }}>
            <h4 style={{ color: "#16794c", margin: "0 0 8px 0" }}>✓ Project Created Successfully!</h4>
            <p style={{ fontSize: "14px", margin: "0 0 8px 0", color: "#333" }}>Share this single shared passkey with all your team members:</p>
            <div style={{ background: "#fff", padding: "10px", fontWeight: "bold", fontSize: "18px", letterSpacing: "1px", color: "#6b2945", textAlign: "center", borderRadius: "6px", border: "1px dashed #16794c" }}>
              {generatedPasskey}
            </div>
          </div>
        )}
      </div>

      {/* ==========================
          PROJECT LIST
      ========================== */}

      <h2
        style={{
          marginTop: "40px",
        }}
      >
        My Projects
      </h2>

      {projects.length === 0 ? (

        <p>No projects created yet.</p>

      ) : (

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >

          {projects.map((project) => (

            <div
              key={project._id}
              className="project-card"
              style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            >

              <h2>{project.projectName}</h2>

              <p style={{ color: "#666", fontSize: "14px", marginBottom: "12px" }}>
                {project.description ||
                  "No description provided"}
              </p>

              {project.passkey && (
                <div style={{ background: "#fdf4f6", padding: "8px 12px", borderRadius: "8px", marginBottom: "12px", border: "1px solid #f3d6df" }}>
                  <span style={{ fontSize: "12px", color: "#777", display: "block" }}>Shared Passkey:</span>
                  <strong style={{ color: "#6b2945", letterSpacing: "1px" }}>{project.passkey}</strong>
                </div>
              )}

              <p style={{ fontSize: "13px", color: "#555" }}>
                <strong>Created By:</strong>{" "}
                {project.createdBy?.name ||
                  "Unknown"}
              </p>

              <p style={{ fontSize: "13px", color: "#555" }}>
                <strong>Created:</strong>{" "}
                {project.createdAt
                  ? new Date(
                      project.createdAt
                    ).toLocaleString()
                  : "N/A"}
              </p>

            </div>

          ))}

        </div>

      )}
    </div>
  );
}