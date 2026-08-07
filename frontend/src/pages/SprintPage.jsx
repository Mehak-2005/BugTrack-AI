import { useEffect, useState } from "react";
import SprintModal from "../components/SprintModal";

import {
  getSprints,
  createSprint,
  deleteSprint,
} from "../services/sprintService";

import { getProjects } from "../services/projectService";

export default function SprintPage() {
  const [sprints, setSprints] = useState([]);
  const [projects, setProjects] = useState([]);
  const [creating, setCreating] = useState(false);
  const [showSprintModal, setShowSprintModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    project: "",
  });

  useEffect(() => {
    fetchSprints();
    fetchProjects();
  }, []);

  const fetchSprints = async () => {
    try {
      const data = await getSprints();
      setSprints(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      console.log("Projects API Response:", data);
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

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

      setForm({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        project: "",
      });

      setShowSprintModal(false);

      fetchSprints();
    } catch (err) {
      console.error(err);
      alert("Failed to create sprint.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSprint = async (id) => {
    if (!window.confirm("Delete this sprint?")) return;

    try {
      await deleteSprint(id);
      fetchSprints();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        padding: "40px",
      }}
    >
      {/* Header */}

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
          onClick={() => setShowSprintModal(true)}
          style={{
            padding: "14px 24px",
            border: "none",
            borderRadius: "12px",
            background:
              "linear-gradient(135deg,#702f43,#91465d)",
            color: "#fff",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          + Create Sprint
        </button>
      </div>

      {/* Sprint Cards */}

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
              boxShadow:
                "0 10px 30px rgba(0,0,0,.08)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                color: "#702f43",
              }}
            >
              {sprint.name}
            </h2>

            <p
              style={{
                color: "#555",
              }}
            >
              {sprint.description}
            </p>

            <p
              style={{
                color: "#444",
                marginTop: "18px",
              }}
            >
              📅{" "}
              {new Date(
                sprint.startDate
              ).toLocaleDateString()}
              {" - "}
              {new Date(
                sprint.endDate
              ).toLocaleDateString()}
            </p>

            <button
              onClick={() =>
                handleDeleteSprint(sprint._id)
              }
              style={{
                marginTop: "15px",
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
          </div>
        ))
      )}

      {/* Modal */}

      <SprintModal
        open={showSprintModal}
        onClose={() => setShowSprintModal(false)}
        form={form}
        setForm={setForm}
        projects={projects}
        createSprint={handleCreateSprint}
        creating={creating}
      />
    </div>
  );
}