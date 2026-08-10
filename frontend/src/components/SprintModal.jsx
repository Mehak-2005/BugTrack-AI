import React from "react";
import Modal from "./Modal";

export default function SprintModal({
  open,
  onClose,
  form,
  setForm,
  projects,
  createSprint,
  updateSprint,
  creating,
  editing,
}) {
  // ========================================
  // HANDLE FORM SUBMISSION
  // ========================================

  const handleSubmit = () => {
    if (editing) {
      updateSprint();
    } else {
      createSprint();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title=""
      width="700px"
    >
      {/* ========================================
          HEADER
      ======================================== */}

      <div style={{ marginBottom: "25px" }}>
        <h2
          style={{
            margin: 0,
            color: "#702f43",
            fontSize: "30px",
          }}
        >
          {editing ? "Edit Sprint" : "Create Sprint"}
        </h2>

        <p
          style={{
            marginTop: "8px",
            color: "#777",
          }}
        >
          {editing
            ? "Update the details of your sprint."
            : "Create a new sprint for your project."}
        </p>
      </div>

      {/* ========================================
          SPRINT NAME
      ======================================== */}

      <div style={{ marginBottom: "18px" }}>
        <label style={labelStyle}>
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

      {/* ========================================
          DESCRIPTION
      ======================================== */}

      <div style={{ marginBottom: "18px" }}>
        <label style={labelStyle}>
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

      {/* ========================================
          DATES
      ======================================== */}

      <div
        style={{
          display: "flex",
          gap: "18px",
          marginBottom: "18px",
        }}
      >
        {/* START DATE */}

        <div style={{ flex: 1 }}>
          <label style={labelStyle}>
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

        {/* END DATE */}

        <div style={{ flex: 1 }}>
          <label style={labelStyle}>
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

      {/* ========================================
          PROJECT
      ======================================== */}

      <div style={{ marginBottom: "25px" }}>
        <label style={labelStyle}>
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
          style={inputStyle}
        >
          <option value="">
            Select Project
          </option>

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

      {/* ========================================
          BUTTONS
      ======================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
        }}
      >
        {/* CANCEL */}

        <button
          type="button"
          onClick={onClose}
          disabled={creating}
          style={{
            padding: "11px 22px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            background: "#fff",
            cursor: creating
              ? "not-allowed"
              : "pointer",
            color: "#555",
          }}
        >
          Cancel
        </button>

        {/* CREATE / UPDATE */}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={creating}
          style={{
            padding: "11px 24px",
            border: "none",
            borderRadius: "10px",
            background:
              "linear-gradient(135deg,#702f43,#91465d)",
            color: "#fff",
            fontWeight: "700",
            cursor: creating
              ? "not-allowed"
              : "pointer",
          }}
        >
          {creating
            ? editing
              ? "Updating..."
              : "Creating..."
            : editing
            ? "Update Sprint"
            : "Create Sprint"}
        </button>
      </div>
    </Modal>
  );
}

// ========================================
// LABEL STYLE
// ========================================

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
  color: "#702f43",
};

// ========================================
// INPUT STYLE
// ========================================

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  boxSizing: "border-box",
  fontSize: "14px",
  background: "#fff",
};