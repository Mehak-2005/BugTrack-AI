import React from "react";
import Modal from "./Modal";

export default function SprintModal({
  open,
  onClose,
  form,
  setForm,
  projects,
  createSprint,
  creating,
}) {
    console.log("Projects received in Modal:", projects);
  return (
    <Modal
      open={open}
      onClose={onClose}
      title=""
      width="700px"
    >
      <div style={{ marginBottom: "25px" }}>
        <h2
          style={{
            margin: 0,
            color: "#702f43",
            fontSize: "30px",
          }}
        >
           Create Sprint
        </h2>

        <p
          style={{
            marginTop: "8px",
            color: "#777",
          }}
        >
          Create a new sprint for your project.
        </p>
      </div>

      {/* Sprint Name */}

      <div style={{ marginBottom: "18px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "600",
            color: "#702f43",
          }}
        >
          Sprint Name
        </label>

        <input
          type="text"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          placeholder="Sprint 1"
          style={inputStyle}
        />
      </div>

      {/* Description */}

      <div style={{ marginBottom: "18px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "600",
            color: "#702f43",
          }}
        >
          Description
        </label>

        <textarea
          rows={4}
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          placeholder="Describe this sprint..."
          style={{
            ...inputStyle,
            resize: "none",
          }}
        />
      </div>

      {/* Dates */}

      <div
        style={{
          display: "flex",
          gap: "18px",
          marginBottom: "18px",
        }}
      >
        <div style={{ flex: 1 }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#702f43",
            }}
          >
            Start Date
          </label>

          <input
            type="date"
            value={form.startDate}
            onChange={(e) =>
              setForm({
                ...form,
                startDate: e.target.value,
              })
            }
            style={inputStyle}
          />
        </div>

        <div style={{ flex: 1 }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#702f43",
            }}
          >
            End Date
          </label>

          <input
            type="date"
            value={form.endDate}
            onChange={(e) =>
              setForm({
                ...form,
                endDate: e.target.value,
              })
            }
            style={inputStyle}
          />
        </div>
      </div>

      {/* Project */}

      <div style={{ marginBottom: "25px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "600",
            color: "#702f43",
          }}
        >
          Project
        </label>

        <select
          value={form.project}
          onChange={(e) =>
            setForm({
              ...form,
              project: e.target.value,
            })
          }
        >
          <option value="">Select Project</option>

          {projects.map((project) => (
            <option
              key={project._id}
              value={project._id}
            >
              {project.projectName}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
        }}
      >
        <button
          onClick={onClose}
          style={{
            padding: "11px 22px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>

        <button
          onClick={createSprint}
          disabled={creating}
          style={{
            padding: "11px 24px",
            border: "none",
            borderRadius: "10px",
            background:
              "linear-gradient(135deg,#702f43,#91465d)",
            color: "#fff",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          {creating ? "Creating..." : "Create Sprint"}
        </button>
      </div>
    </Modal>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  boxSizing: "border-box",
  fontSize: "14px",
};