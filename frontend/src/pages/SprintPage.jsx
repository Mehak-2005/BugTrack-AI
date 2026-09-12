import { useEffect, useState } from "react";
import SprintModal from "../components/SprintModal";
import SprintRadarModal from "../components/SprintRadarModal";

import {
  getSprints,
  createSprint,
  updateSprint,
  deleteSprint,
  getSprintHealthRadar,
  getSprintReleaseNotes,
} from "../services/sprintService";

import { getProjects } from "../services/projectService";
import ReleaseNotesModal from "../components/ReleaseNotesModal"; 
export default function SprintPage() {
  // ========================================
  // STATE
  // ========================================

  const [sprints, setSprints] = useState([]);
  const [projects, setProjects] = useState([]);

  const [creating, setCreating] = useState(false);
  const [showSprintModal, setShowSprintModal] = useState(false);

  // Used to determine Create vs Edit mode
  const [editing, setEditing] = useState(false);

  // Stores the sprint currently being edited
  const [editingSprintId, setEditingSprintId] = useState(null);

  // AI Sprint Radar Modal State
  const [radarOpen, setRadarOpen] = useState(false);
  const [radarLoading, setRadarLoading] = useState(false);
  const [radarData, setRadarData] = useState(null);
const [notesOpen, setNotesOpen] = useState(false);
const [notesLoading, setNotesLoading] = useState(false);
const [notesData, setNotesData] = useState(null);
const [selectedSprintName, setSelectedSprintName] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    project: "",
  });

  // ========================================
  // FETCH DATA
  // ========================================

  useEffect(() => {
    fetchSprints();
    fetchProjects();
  }, []);

  // ========================================
  // GET SPRINTS
  // ========================================

  const fetchSprints = async () => {
    try {
      const data = await getSprints();
      setSprints(data);
    } catch (err) {
      console.error("Failed to fetch sprints:", err);
    }
  };

  // ========================================
  // GET PROJECTS
  // ========================================

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  // ========================================
  // RESET FORM
  // ========================================

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      project: "",
    });

    setEditing(false);
    setEditingSprintId(null);
  };

  // ========================================
  // OPEN CREATE MODAL
  // ========================================

  const handleOpenCreate = () => {
    resetForm();
    setShowSprintModal(true);
  };

  // ========================================
  // CREATE SPRINT
  // ========================================

  const handleCreateSprint = async () => {
    if (
      !form.name ||
      !form.description ||
      !form.startDate ||
      !form.endDate ||
      !form.project
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setCreating(true);

      await createSprint(form);

      resetForm();

      setShowSprintModal(false);

      await fetchSprints();
    } catch (err) {
      console.error("Create sprint error:", err);
      alert("Failed to create sprint.");
    } finally {
      setCreating(false);
    }
  };

  // ========================================
  // OPEN EDIT MODAL
  // ========================================

  const handleOpenEdit = (sprint) => {
    setEditing(true);
    setEditingSprintId(sprint._id);

    setForm({
      name: sprint.name || "",
      description: sprint.description || "",
      startDate: sprint.startDate
        ? new Date(sprint.startDate).toISOString().split("T")[0]
        : "",
      endDate: sprint.endDate
        ? new Date(sprint.endDate).toISOString().split("T")[0]
        : "",
      project: sprint.project?._id || sprint.project || "",
    });

    setShowSprintModal(true);
  };

  // ========================================
  // UPDATE SPRINT
  // ========================================

  const handleUpdateSprint = async () => {
    if (!editingSprintId) {
      alert("No sprint selected for editing.");
      return;
    }

    if (
      !form.name ||
      !form.description ||
      !form.startDate ||
      !form.endDate ||
      !form.project
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setCreating(true);

      await updateSprint(editingSprintId, form);

      alert("Sprint updated successfully.");

      resetForm();

      setShowSprintModal(false);

      await fetchSprints();
    } catch (err) {
      console.error("Update sprint error:", err);
      alert("Failed to update sprint.");
    } finally {
      setCreating(false);
    }
  };

  // ========================================
  // CLOSE MODAL
  // ========================================

  const handleCloseModal = () => {
    if (creating) return;

    setShowSprintModal(false);
    resetForm();
  };

  // ========================================
  // DELETE SPRINT
  // ========================================

  const handleDeleteSprint = async (id) => {
    if (!window.confirm("Delete this sprint?")) {
      return;
    }

    try {
      await deleteSprint(id);
      await fetchSprints();
    } catch (err) {
      console.error("Delete sprint error:", err);
      alert("Failed to delete sprint.");
    }
  };

  // ========================================
  // OPEN AI SPRINT RADAR
  // ========================================

  const handleOpenRadar = async (sprintId) => {
    setRadarData(null);
    setRadarOpen(true);
    setRadarLoading(true);

    try {
      const data = await getSprintHealthRadar(sprintId);
      setRadarData(data);
    } catch (err) {
      console.error("Sprint health radar error:", err);
      alert(err.message || "Failed to analyze sprint health.");
    } finally {
      setRadarLoading(false);
    }
  };
  const handleOpenReleaseNotes = async (sprint) => {
  setSelectedSprintName(sprint.name);
  setNotesData(null);
  setNotesOpen(true);
  setNotesLoading(true);

  try {
    const data = await getSprintReleaseNotes(sprint._id);
    setNotesData(data);
  } catch (err) {
    console.error("Release notes error:", err);
    alert(err.message || "Failed to generate release notes");
  } finally {
    setNotesLoading(false);
  }
};

  // ========================================
  // UI
  // ========================================

  return (
    <div style={{ padding: "40px" }}>
      {/* ========================================
          HEADER
      ======================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "35px",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#702f43",
            fontSize: "48px",
          }}
        >
          Sprint Planning
        </h1>

        <button
          onClick={handleOpenCreate}
          style={{
            padding: "14px 24px",
            border: "none",
            borderRadius: "12px",
            background: "linear-gradient(135deg,#702f43,#91465d)",
            color: "#fff",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          + Create Sprint
        </button>
      </div>

      {/* ========================================
          SPRINT CARDS
      ======================================== */}

      {sprints.length === 0 ? (
        <div
          style={{
            background: "#fff",
            padding: "50px",
            borderRadius: "20px",
            textAlign: "center",
            color: "#777",
          }}
        >
          No sprints created yet.
        </div>
      ) : (
        sprints.map((sprint) => (
          <div
            key={sprint._id}
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "30px",
              marginBottom: "25px",
              boxShadow: "0 10px 30px rgba(0,0,0,.08)",
            }}
          >
            {/* SPRINT NAME */}
            <h2
              style={{
                marginTop: 0,
                color: "#702f43",
              }}
            >
              {sprint.name}
            </h2>

            {/* DESCRIPTION */}
            <p style={{ color: "#555" }}>{sprint.description}</p>

            {/* PROJECT + DATES */}
            <p
              style={{
                color: "#666",
                marginTop: "10px",
                fontWeight: "600",
              }}
            >
              Project: {sprint.project?.projectName || "No Project"}
              {"   "}
              📅 {new Date(sprint.startDate).toLocaleDateString()}
              {" - "}
              {new Date(sprint.endDate).toLocaleDateString()}
            </p>

            {/* ========================================
                BUTTONS
            ======================================== */}

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "15px",
                flexWrap: "wrap",
              }}
            >
              {/* EDIT */}
              <button
                onClick={() => handleOpenEdit(sprint)}
                style={{
                  padding: "10px 18px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#702f43",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Edit Sprint
              </button>

              {/* DELETE */}
              <button
                onClick={() => handleDeleteSprint(sprint._id)}
                style={{
                  padding: "10px 18px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#e53935",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Delete Sprint
              </button>

              {/* AI SPRINT RADAR */}
              <button
  onClick={() => handleOpenRadar(sprint._id)}
  style={{
    padding: "10px 18px",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #702f43 0%, #3b1421 100%)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 4px 12px rgba(112, 47, 67, 0.25)",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
>
   AI Health Radar
</button>
<button
  onClick={() => handleOpenReleaseNotes(sprint)}
  style={{
    padding: "10px 18px",
    border: "none",
    borderRadius: "10px",
    background: "#4b5563",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  }}
>
   Release Notes
</button>
            </div>
          </div>
        ))
      )}

      {/* ========================================
          SPRINT CREATE / EDIT MODAL
      ======================================== */}
      <SprintModal
        open={showSprintModal}
        onClose={handleCloseModal}
        form={form}
        setForm={setForm}
        projects={projects}
        createSprint={handleCreateSprint}
        updateSprint={handleUpdateSprint}
        creating={creating}
        editing={editing}
      />

      {/* ========================================
          AI SPRINT HEALTH RADAR MODAL
      ======================================== */}
      <SprintRadarModal
        isOpen={radarOpen}
        onClose={() => setRadarOpen(false)}
        radarData={radarData}
        loading={radarLoading}
      />
      <ReleaseNotesModal
  isOpen={notesOpen}
  onClose={() => setNotesOpen(false)}
  notesData={notesData}
  loading={notesLoading}
  sprintName={selectedSprintName}
/>
    </div>
  );
}