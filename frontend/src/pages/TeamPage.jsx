import React, {
  useEffect,
  useState,
} from "react";

import {
  getTeamMembers,
  addTeamMember,
  deleteTeamMember,
  updateAssignedTaskStatus,
} from "../services/teamService";

function TeamPage() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] =
  useState(null);

const [selectedTask, setSelectedTask] =
  useState(null);

const [taskStatus, setTaskStatus] =
  useState("Open");

const [updatingTask, setUpdatingTask] =
  useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [error, setError] = useState("");
  // Selected task for Task Details popup


  const [formData, setFormData] = useState({
    name: "",
    role: "Developer",
    skills: "",
    experience: "",
    workload: 40,
    email: "",
  });

  // ==========================================
  // LOAD TEAM MEMBERS
  // ==========================================

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTeamMembers();

      setMembers(data);
    } catch (error) {
      console.error(
        "Error loading team members:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load team members."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // ADD TEAM MEMBER
  // ==========================================

  const handleAddMember = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter the member name.");
      return;
    }

    if (!formData.role) {
      alert("Please select a role.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // Convert experience text to number
      let experienceValue = 0;

      if (formData.experience === "1 Year") {
        experienceValue = 1;
      } else if (
        formData.experience === "2 Years"
      ) {
        experienceValue = 2;
      } else if (
        formData.experience === "3 Years"
      ) {
        experienceValue = 3;
      } else if (
        formData.experience === "4 Years"
      ) {
        experienceValue = 4;
      } else if (
        formData.experience === "5+ Years"
      ) {
        experienceValue = 5;
      }

      // Convert skills into array
      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const memberData = {
        name: formData.name.trim(),
        role: formData.role,
        skills: skillsArray,
        experience: experienceValue,
        workload: Number(formData.workload),
        email: formData.email.trim(),
      };

      const response =
        await addTeamMember(memberData);

      // Add returned MongoDB member
      setMembers((prevMembers) => [
        response.member,
        ...prevMembers,
      ]);

      // Reset form
      setFormData({
        name: "",
        role: "Developer",
        skills: "",
        experience: "",
        workload: 40,
        email: "",
      });

      setShowForm(false);

    } catch (error) {
      console.error(
        "Error adding team member:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to add team member."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE MEMBER
  // ==========================================

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      setError("");

      await deleteTeamMember(id);

      setMembers((prevMembers) =>
        prevMembers.filter(
          (member) => member._id !== id
        )
      );

    } catch (error) {
      console.error(
        "Error deleting team member:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to remove team member."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
  };

  

 // ==========================================
// OPEN ASSIGNED TASKS POPUP
// ==========================================

const handleTaskClick = (member) => {
  setSelectedMember(member);
};

// ==========================================
// CLOSE ASSIGNED TASKS POPUP
// ==========================================

const closeTaskPopup = () => {
  setSelectedMember(null);
};

// ==========================================
// UPDATE ASSIGNED TASK STATUS
// ==========================================

const handleTaskStatusChange = async (
  memberId,
  taskId,
  newStatus
) => {
  try {
    setError("");

    await updateAssignedTaskStatus(
      memberId,
      taskId,
      newStatus
    );

    // Update popup immediately
    setSelectedMember((prevMember) => {
      if (!prevMember) return prevMember;

      return {
        ...prevMember,

        assignedTasks:
          prevMember.assignedTasks.map((task) =>
            task._id === taskId
              ? {
                  ...task,
                  status: newStatus,
                }
              : task
          ),
      };
    });

    // Also update the main team member list
    setMembers((prevMembers) =>
      prevMembers.map((member) => {
        if (member._id !== memberId) {
          return member;
        }

        return {
          ...member,

          assignedTasks:
            member.assignedTasks?.map((task) =>
              task._id === taskId
                ? {
                    ...task,
                    status: newStatus,
                  }
                : task
            ),
        };
      })
    );

  } catch (error) {
    console.error(
      "Error updating task status:",
      error
    );

    setError(
      error.response?.data?.message ||
        "Unable to update task status."
    );
  }
};
  // ==========================================
  // FORMAT EXPERIENCE
  // ==========================================

  const formatExperience = (experience) => {
    if (
      experience === undefined ||
      experience === null
    ) {
      return "Not specified";
    }

    if (Number(experience) === 0) {
      return "Fresher";
    }

    if (Number(experience) === 1) {
      return "1 Year";
    }

    if (Number(experience) >= 5) {
      return "5+ Years";
    }

    return `${experience} Years`;
  };


  // ==========================================
// OPEN TASK DETAILS
// ==========================================

const openTaskDetails = (member, task) => {
  setSelectedMember(member);
  setSelectedTask(task);
  setTaskStatus(task.status || "Open");
};

// ==========================================
// CLOSE TASK DETAILS
// ==========================================

const closeTaskDetails = () => {
  if (updatingTask) return;

  setSelectedMember(null);
  setSelectedTask(null);
  setTaskStatus("Open");
};

// ==========================================
// UPDATE TASK STATUS
// ==========================================

const handleTaskStatusUpdate = async () => {
  if (!selectedMember || !selectedTask) {
    return;
  }

  try {
    setUpdatingTask(true);
    setError("");

    const response =
      await updateAssignedTaskStatus(
        selectedMember._id,
        selectedTask._id,
        taskStatus
      );

    // Update task inside frontend state
    setMembers((prevMembers) =>
      prevMembers.map((member) => {
        if (member._id !== selectedMember._id) {
          return member;
        }

        return {
          ...member,
          assignedTasks:
            member.assignedTasks?.map((task) =>
              task._id === selectedTask._id
                ? {
                    ...task,
                    status: taskStatus,
                  }
                : task
            ),
        };
      })
    );

    // Update currently selected task
    setSelectedTask((prev) =>
      prev
        ? {
            ...prev,
            status: taskStatus,
          }
        : prev
    );

    // Update selected member
    setSelectedMember((prev) =>
      prev
        ? {
            ...prev,
            assignedTasks:
              prev.assignedTasks?.map((task) =>
                task._id === selectedTask._id
                  ? {
                      ...task,
                      status: taskStatus,
                    }
                  : task
              ),
          }
        : prev
    );

    alert(
      response.message ||
        "Task status updated successfully."
    );

  } catch (error) {
    console.error(
      "Error updating task status:",
      error
    );

    setError(
      error.response?.data?.message ||
        "Unable to update task status."
    );
  } finally {
    setUpdatingTask(false);
  }
};
  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingState}>
          <div style={styles.loadingIcon}>
            👥
          </div>

          <h2 style={styles.loadingTitle}>
            Loading Team Members...
          </h2>

          <p style={styles.loadingText}>
            Fetching your project team.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* ======================================
          HEADER
      ====================================== */}

      <div style={styles.header}>

        <div>

          <div style={styles.pageLabel}>
            👥 TEAM MANAGEMENT
          </div>

          <h1 style={styles.title}>
            Team Members
          </h1>

          <p style={styles.subtitle}>
            Add and manage developers, testers and
            project members
          </p>

        </div>

        <button
          style={styles.addButton}
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          ＋ Add Member
        </button>

      </div>


      {/* ======================================
          ERROR MESSAGE
      ====================================== */}

      {error && (
        <div style={styles.errorBox}>
          ⚠️ {error}
        </div>
      )}


      {/* ======================================
          ADD MEMBER FORM
      ====================================== */}

      {showForm && (

        <div style={styles.formCard}>

          {/* FORM HEADER */}

          <div style={styles.formHeader}>

            <div style={styles.formIcon}>
              👤
            </div>

            <div>

              <h2 style={styles.formTitle}>
                Add Team Member
              </h2>

              <p style={styles.formSubtitle}>
                Enter the member's details and skills
              </p>

            </div>

          </div>


          {/* FORM */}

          <form onSubmit={handleAddMember}>

            <div style={styles.formGrid}>

              {/* NAME */}

              <div style={styles.field}>

                <label style={styles.label}>
                  <span>👤</span>
                  Full Name
                  <span style={styles.required}>
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Priya Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input}
                  disabled={saving}
                />

              </div>


              {/* ROLE */}

              <div style={styles.field}>

                <label style={styles.label}>
                  <span>💼</span>
                  Role
                  <span style={styles.required}>
                    *
                  </span>
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={styles.input}
                  disabled={saving}
                >

                  <option value="Developer">
                    Developer
                  </option>

                  <option value="Frontend Developer">
                    Frontend Developer
                  </option>

                  <option value="Backend Developer">
                    Backend Developer
                  </option>

                  <option value="Full Stack Developer">
                    Full Stack Developer
                  </option>

                  <option value="Tester">
                    Tester
                  </option>

                  <option value="QA Engineer">
                    QA Engineer
                  </option>

                  <option value="UI/UX Designer">
                    UI/UX Designer
                  </option>

                  <option value="DevOps Engineer">
                    DevOps Engineer
                  </option>

                  <option value="Data Scientist">
                    Data Scientist
                  </option>

                  <option value="Project Manager">
                    Project Manager
                  </option>

                  <option value="Team Lead">
                    Team Lead
                  </option>

                  <option value="Product Manager">
                    Product Manager
                  </option>

                </select>

              </div>


              {/* SKILLS */}

              <div style={styles.field}>

                <label style={styles.label}>
                  <span>🛠️</span>
                  Skills
                </label>

                <input
                  type="text"
                  name="skills"
                  placeholder="React, Node.js, MongoDB, Java"
                  value={formData.skills}
                  onChange={handleChange}
                  style={styles.input}
                  disabled={saving}
                />

                <div style={styles.helper}>
                  Add multiple skills separated by
                  commas
                </div>

              </div>


              {/* EXPERIENCE */}

              <div style={styles.field}>

                <label style={styles.label}>
                  <span>🎓</span>
                  Experience
                </label>

                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  style={styles.input}
                  disabled={saving}
                >

                  <option value="">
                    Select experience
                  </option>

                  <option value="Fresher">
                    Fresher
                  </option>

                  <option value="1 Year">
                    1 Year
                  </option>

                  <option value="2 Years">
                    2 Years
                  </option>

                  <option value="3 Years">
                    3 Years
                  </option>

                  <option value="4 Years">
                    4 Years
                  </option>

                  <option value="5+ Years">
                    5+ Years
                  </option>

                </select>

              </div>

              {/* WORKLOAD BAR */}

<div style={styles.progressContainer}>

  <div style={styles.progressHeader}>

    <span>
      Workload
    </span>

    <span>
      {formData.workload ?? 0}%
    </span>

  </div>

  <div style={styles.progressBackground}>

    <div
      style={{
        ...styles.progressBar,
        width: `${formData.workload ?? 0}%`,
      }}
    />

  </div>

</div>




              {/* EMAIL */}

              <div style={styles.field}>

                <label style={styles.label}>
                  <span>✉️</span>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="member@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                  disabled={saving}
                />

              </div>

            </div>


            {/* FORM ACTIONS */}

            <div style={styles.formActions}>

              <button
                type="button"
                style={styles.cancelButton}
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                style={styles.saveButton}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "＋ Add Team Member"}
              </button>

            </div>

          </form>

        </div>
      )}


      {/* ======================================
          TEAM MEMBERS
      ====================================== */}

      {members.length === 0 ? (

        <div style={styles.emptyState}>

          <div style={styles.emptyIcon}>
            👥
          </div>

          <h2 style={styles.emptyTitle}>
            No team members yet
          </h2>

          <p style={styles.emptyText}>
            Add your developers, testers and other
            project members to start managing your team.
          </p>

          <button
            style={styles.addButton}
            onClick={() => setShowForm(true)}
          >
            ＋ Add First Member
          </button>

        </div>

      ) : (

        <div style={styles.grid}>

          {members.map((member) => (

            <div
              key={member._id}
              style={styles.card}
            >

              {/* MEMBER HEADER */}

              <div style={styles.memberHeader}>

                <div style={styles.avatar}>
                  {member.name
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <div>

                  <h2 style={styles.name}>
                    {member.name}
                  </h2>

                  <span style={styles.role}>
                    {member.role}
                  </span>

                </div>

              </div>


              {/* SKILLS */}

              <div style={styles.section}>

                <div style={styles.sectionTitle}>
                  🛠️ Skills
                </div>

                <div style={styles.skills}>

                  {member.skills &&
                  member.skills.length > 0 ? (

                    member.skills.map(
                      (skill, index) => (

                        <span
                          key={index}
                          style={styles.skill}
                        >
                          {skill}
                        </span>

                      )
                    )

                  ) : (

                    <span style={styles.noData}>
                      No skills added
                    </span>

                  )}

                </div>

              </div>


              {/* INFORMATION */}

              <div style={styles.info}>

                <div style={styles.infoItem}>

                  <span>
                    🎓 Experience
                  </span>

                  <strong>
                    {formatExperience(
                      member.experience
                    )}
                  </strong>

                </div>

                <div style={styles.infoItem}>

                  <span>
                    📊 Workload
                  </span>

                  <strong>
                    {member.workload ?? 0}%
                  </strong>

                </div>

              </div>


              {/* WORKLOAD BAR */}

              <div style={styles.progressContainer}>

                <div style={styles.progressHeader}>

                  <span>
                    Workload
                  </span>

                  <span>
                    {member.workload ?? 0}%
                  </span>

                </div>

                <div style={styles.progressBackground}>

                  <div
                    style={{
                      ...styles.progressBar,
                      width: `${member.workload ?? 0}%`,
                    }}
                  />

                </div>

              </div>
              {/* ======================================
    ASSIGNED TASKS
====================================== */}

<div
  style={styles.assignedTasksSection}
  onClick={() => handleTaskClick(member)}
>

  <div style={styles.assignedTasksHeader}>

    <div style={styles.assignedTasksTitle}>
      📋 Assigned Tasks
    </div>

    <span style={styles.taskCount}>
      {member.assignedTasks?.length || 0}
    </span>

  </div>

  <div style={styles.viewTasksText}>
    Click to view assigned tasks →
  </div>

</div>
              {/* EMAIL */}

              {member.email && (

                <div style={styles.email}>
                  ✉️ {member.email}
                </div>

              )}


              {/* DELETE */}

              <button
                style={styles.deleteButton}
                onClick={() =>
                  handleDelete(member._id)
                }
                disabled={
                  deletingId === member._id
                }
              >
                {deletingId === member._id
                  ? "Removing..."
                  : "🗑 Remove Member"}
              </button>

            </div>

          ))}

        </div>

      )}

      {/* ======================================
    ASSIGNED TASKS POPUP
====================================== */}

{selectedMember && (

  <div
    style={styles.modalOverlay}
    onClick={closeTaskPopup}
  >

    <div
      style={styles.taskModal}
      onClick={(e) => e.stopPropagation()}
    >

      {/* MODAL HEADER */}

      <div style={styles.modalHeader}>

        <div>

          <div style={styles.modalLabel}>
            📋 ASSIGNED TASKS
          </div>

          <h2 style={styles.modalTitle}>
            {selectedMember.name}
          </h2>

          <div style={styles.modalMemberRole}>
            {selectedMember.role}
          </div>

        </div>

        <button
          style={styles.modalClose}
          onClick={closeTaskPopup}
        >
          ×
        </button>

      </div>


      {/* MODAL BODY */}

      <div style={styles.modalBody}>

        {selectedMember.assignedTasks?.length > 0 ? (

          <div style={styles.popupTaskList}>

           {selectedMember.assignedTasks.map(
  (task, index) => (

    <div
      key={
        task._id ||
        task.issueId ||
        index
      }
      style={styles.popupTaskCard}
      onClick={() =>
        openTaskDetails(selectedMember, task)
      }
    >

                  {/* TASK TITLE */}

                  <div style={styles.popupTaskTitle}>
                    {task.title}
                  </div>


                  {/* TASK META */}

                  <div style={styles.taskMeta}>

                    <span
                      style={{
                        ...styles.priorityBadge,

                        background:
                          task.priority === "Critical"
                            ? "#fde2e2"
                            : task.priority === "High"
                            ? "#fff0d9"
                            : task.priority === "Low"
                            ? "#e6f4ea"
                            : "#f7e6eb",

                        color:
                          task.priority === "Critical"
                            ? "#b42318"
                            : task.priority === "High"
                            ? "#a15c00"
                            : task.priority === "Low"
                            ? "#26733d"
                            : "#702f43",
                      }}
                    >
                      {task.priority || "Medium"}
                    </span>


               <select
  value={task.status || "Open"}
  onClick={(e) => e.stopPropagation()}
  onChange={(e) =>
    handleTaskStatusChange(
      selectedMember._id,
      task._id,
      e.target.value
    )
  }
  style={styles.statusSelect}
>
  <option value="Open">
    Open
  </option>

  <option value="In Progress">
    In Progress
  </option>

  <option value="In Review">
    In Review
  </option>

  <option value="Resolved">
    Resolved
  </option>
</select>

                  </div>


                  {/* ASSIGNED DATE */}

                  {task.assignedAt && (

                    <div style={styles.assignedDate}>
                      Assigned on{" "}
                      {new Date(
                        task.assignedAt
                      ).toLocaleDateString()}
                    </div>

                  )}

                </div>

              )
            )}

          </div>

        ) : (

          <div style={styles.noAssignedTasks}>
            📋 No tasks assigned yet
          </div>

        )}

      </div>


      {/* MODAL FOOTER */}

      <div style={styles.modalFooter}>

        <button
          style={styles.modalCloseButton}
          onClick={closeTaskPopup}
        >
          Close
        </button>

      </div>

    </div>

  </div>

)}

    </div>
  );
}


// ==================================================
// STYLES
// ==================================================

const styles = {

  page: {
    padding: "34px",
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #fff9f7 0%, #fdf4f6 100%)",
    boxSizing: "border-box",
  },

  // ================================================
  // HEADER
  // ================================================

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },

  pageLabel: {
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1.2px",
    color: "#9a526a",
    marginBottom: "7px",
  },

  title: {
    margin: 0,
    color: "#702f43",
    fontSize: "32px",
    fontWeight: "750",
  },

  subtitle: {
    marginTop: "8px",
    marginBottom: 0,
    color: "#806c72",
    fontSize: "15px",
  },

  addButton: {
    background:
      "linear-gradient(135deg, #702f43, #8d4059)",
    color: "white",
    border: "none",
    padding: "13px 22px",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow:
      "0 6px 15px rgba(112, 47, 67, 0.20)",
  },

  // ================================================
  // ERROR
  // ================================================

  errorBox: {
    background: "#fff1f3",
    border: "1px solid #edc3cc",
    color: "#a83252",
    padding: "12px 15px",
    borderRadius: "9px",
    marginBottom: "20px",
    fontSize: "14px",
    fontWeight: "600",
  },

  // ================================================
  // LOADING
  // ================================================

  loadingState: {
    textAlign: "center",
    background: "#ffffff",
    border: "1px solid #eadbdd",
    borderRadius: "18px",
    padding: "80px 25px",
    boxShadow:
      "0 8px 25px rgba(112, 47, 67, 0.07)",
  },

  loadingIcon: {
    fontSize: "45px",
    marginBottom: "15px",
  },

  loadingTitle: {
    color: "#702f43",
    margin: "0 0 8px",
  },

  loadingText: {
    color: "#806c72",
    margin: 0,
  },

  // ================================================
  // FORM CARD
  // ================================================

  formCard: {
    background: "#ffffff",
    border: "1px solid #eadbdd",
    borderRadius: "18px",
    padding: "30px",
    marginBottom: "30px",
    boxShadow:
      "0 12px 30px rgba(112, 47, 67, 0.10)",
  },

  formHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    paddingBottom: "24px",
    marginBottom: "25px",
    borderBottom: "1px solid #f0e3e6",
  },

  formIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "#f7e6eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
  },

  formTitle: {
    margin: 0,
    color: "#702f43",
    fontSize: "22px",
    fontWeight: "750",
  },

  formSubtitle: {
    margin: "5px 0 0",
    color: "#8a777d",
    fontSize: "13px",
  },

  // ================================================
  // FORM GRID
  // ================================================

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#3c3034",
    fontSize: "14px",
    fontWeight: "700",
  },

  required: {
    color: "#b4425e",
    fontSize: "16px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    border: "1px solid #dfcfd4",
    borderRadius: "9px",
    background: "#fffdfd",
    color: "#30262a",
    fontSize: "14px",
    outline: "none",
  },

  helper: {
    color: "#99878d",
    fontSize: "12px",
    marginTop: "-2px",
  },

  // ================================================
  // WORKLOAD
  // ================================================

  workloadHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  workloadValue: {
    background: "#f7e6eb",
    color: "#702f43",
    padding: "5px 11px",
    borderRadius: "20px",
    fontWeight: "750",
    fontSize: "13px",
  },

  range: {
    width: "100%",
    height: "6px",
    accentColor: "#702f43",
    cursor: "pointer",
    marginTop: "5px",
  },

  rangeLabels: {
    display: "flex",
    justifyContent: "space-between",
    color: "#a08e94",
    fontSize: "11px",
  },

  // ================================================
  // FORM BUTTONS
  // ================================================

  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "30px",
    paddingTop: "22px",
    borderTop: "1px solid #f0e3e6",
  },

  cancelButton: {
    padding: "12px 22px",
    borderRadius: "9px",
    border: "1px solid #702f43",
    background: "#ffffff",
    color: "#702f43",
    cursor: "pointer",
    fontWeight: "650",
    fontSize: "14px",
  },

  saveButton: {
    padding: "12px 23px",
    borderRadius: "9px",
    border: "none",
    background:
      "linear-gradient(135deg, #702f43, #8d4059)",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow:
      "0 5px 12px rgba(112, 47, 67, 0.18)",
  },

  // ================================================
  // EMPTY STATE
  // ================================================

  emptyState: {
    textAlign: "center",
    background: "#ffffff",
    border: "1px solid #eadbdd",
    borderRadius: "18px",
    padding: "75px 25px",
    boxShadow:
      "0 8px 25px rgba(112, 47, 67, 0.07)",
  },

  emptyIcon: {
    width: "70px",
    height: "70px",
    margin: "0 auto 20px",
    borderRadius: "20px",
    background: "#f7e6eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "35px",
  },

  emptyTitle: {
    color: "#30262a",
    margin: "0 0 10px",
    fontSize: "21px",
  },

  emptyText: {
    color: "#806c72",
    maxWidth: "520px",
    margin: "0 auto 25px",
    lineHeight: "1.6",
  },

  // ================================================
  // MEMBER GRID
  // ================================================

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "22px",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #eadbdd",
    borderRadius: "16px",
    padding: "23px",
    boxShadow:
      "0 8px 22px rgba(112, 47, 67, 0.08)",
  },

  memberHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "22px",
  },

  avatar: {
    width: "52px",
    height: "52px",
    borderRadius: "15px",
    background:
      "linear-gradient(135deg, #702f43, #a04b68)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "750",
    boxShadow:
      "0 5px 12px rgba(112, 47, 67, 0.18)",
  },

  name: {
    margin: 0,
    fontSize: "19px",
    color: "#30262a",
  },

  role: {
    display: "inline-block",
    marginTop: "4px",
    color: "#702f43",
    fontSize: "13px",
    fontWeight: "700",
  },

  section: {
    marginBottom: "20px",
  },

  sectionTitle: {
    color: "#3d3035",
    fontSize: "14px",
    fontWeight: "700",
  },

  skills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "7px",
    marginTop: "10px",
  },

  skill: {
    background: "#f7e6eb",
    color: "#702f43",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },

  noData: {
    color: "#9a8b90",
    fontSize: "13px",
  },

  // ================================================
  // MEMBER INFORMATION
  // ================================================

  info: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    padding: "15px 0",
    borderTop: "1px solid #eee",
    borderBottom: "1px solid #eee",
  },

  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  // ================================================
  // PROGRESS BAR
  // ================================================

  progressContainer: {
    marginTop: "18px",
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#806c72",
    marginBottom: "7px",
  },

  progressBackground: {
    width: "100%",
    height: "7px",
    borderRadius: "10px",
    background: "#f0e3e6",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    borderRadius: "10px",
    background:
      "linear-gradient(90deg, #702f43, #b85b78)",
  },


  // ================================================
// ASSIGNED TASKS
// ================================================

assignedTasksSection: {
  marginTop: "18px",
  padding: "14px",
  borderTop: "1px solid #eee0e4",
  borderBottom: "1px solid #eee0e4",
  background: "#fff8fa",
  borderRadius: "10px",
  cursor: "pointer",
  transition: "all 0.2s ease",
},

assignedTasksHeader: {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
},

assignedTasksTitle: {
  color: "#3d3035",
  fontSize: "14px",
  fontWeight: "700",
},

taskCount: {
  minWidth: "26px",
  height: "26px",
  padding: "0 7px",
  borderRadius: "50%",
  background: "#f7e6eb",
  color: "#702f43",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  fontSize: "12px",
  fontWeight: "750",
},
// ================================================
// POPUP TASK STYLES
// ================================================

popupTaskList: {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
},

popupTaskCard: {
  padding: "15px",
  background: "#fff8fa",
  border: "1px solid #ead9df",
  borderRadius: "11px",
  cursor: "pointer",
  transition: "all 0.2s ease",
},
popupTaskTitle: {
  color: "#30262a",
  fontSize: "14px",
  fontWeight: "700",
  lineHeight: "1.5",
  marginBottom: "10px",
},

viewTasksText: {
  marginTop: "6px",
  color: "#9a526a",
  fontSize: "11px",
  fontWeight: "600",
},

assignedTasksList: {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
},

assignedTaskCard: {
  padding: "13px",
  background: "#fff8fa",
  border: "1px solid #ead9df",
  borderRadius: "10px",
   cursor: "pointer",
  transition: "all 0.2s ease",
},

assignedTaskTitle: {
  color: "#30262a",
  fontSize: "13px",
  fontWeight: "700",
  lineHeight: "1.45",
  marginBottom: "9px",
},

taskMeta: {
  display: "flex",
  alignItems: "center",
  gap: "7px",
  flexWrap: "wrap",
},

priorityBadge: {
  padding: "5px 9px",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: "700",
},

statusBadge: {
  padding: "5px 9px",
  borderRadius: "20px",
  background: "#e8f5eb",
  color: "#28733d",
  fontSize: "11px",
  fontWeight: "700",
},

statusSelect: {
  padding: "5px 9px",
  borderRadius: "20px",
  border: "1px solid #cfe3d4",
  background: "#e8f5eb",
  color: "#28733d",
  fontSize: "11px",
  fontWeight: "700",
  cursor: "pointer",
  outline: "none",
},

assignedDate: {
  marginTop: "8px",
  color: "#98858c",
  fontSize: "11px",
},

noAssignedTasks: {
  padding: "13px",
  textAlign: "center",
  background: "#faf6f7",
  border: "1px dashed #dfcbd2",
  borderRadius: "9px",
  color: "#9a858d",
  fontSize: "12px",
},
  // ================================================
  // EMAIL
  // ================================================

  email: {
    marginTop: "17px",
    color: "#806c72",
    fontSize: "13px",
    padding: "10px 12px",
    background: "#faf5f6",
    borderRadius: "8px",
  },

  // ================================================
  // DELETE
  // ================================================

    deleteButton: {
    width: "100%",
    marginTop: "18px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #e5bfc8",
    background: "#fff4f5",
    color: "#a83252",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },

  // ================================================
  // TASK DETAILS POPUP
  // ================================================

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(48, 38, 42, 0.60)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99999,
    padding: "20px",
    boxSizing: "border-box",
  },

  taskModal: {
    width: "100%",
    maxWidth: "560px",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#ffffff",
    borderRadius: "18px",
    boxShadow: "0 25px 60px rgba(48, 38, 42, 0.30)",
    border: "1px solid #eadbdd",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "22px 25px",
    background: "linear-gradient(135deg, #702f43, #8d4059)",
    color: "#ffffff",
    borderRadius: "18px 18px 0 0",
  },

  modalLabel: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "6px",
    opacity: 0.85,
  },

  modalTitle: {
    margin: 0,
    fontSize: "23px",
    fontWeight: "750",
  },

  modalClose: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(255,255,255,0.18)",
    color: "#ffffff",
    fontSize: "25px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  modalBody: {
    padding: "25px",
  },

  modalMember: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "15px",
    background: "#fff7f9",
    border: "1px solid #ead9df",
    borderRadius: "12px",
    marginBottom: "22px",
  },

  modalAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "13px",
    background: "linear-gradient(135deg, #702f43, #a04b68)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "750",
    fontSize: "19px",
  },

  modalMemberLabel: {
    fontSize: "11px",
    color: "#99878d",
    marginBottom: "3px",
  },

  modalMemberName: {
    fontSize: "17px",
    fontWeight: "750",
    color: "#30262a",
  },

  modalMemberRole: {
    marginTop: "3px",
    fontSize: "12px",
    color: "#702f43",
    fontWeight: "600",
  },

  modalSection: {
    marginBottom: "20px",
  },

  modalSectionLabel: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#806c72",
    marginBottom: "7px",
  },

  modalTaskTitle: {
    fontSize: "16px",
    lineHeight: "1.5",
    fontWeight: "750",
    color: "#30262a",
    padding: "13px",
    background: "#faf5f6",
    borderRadius: "9px",
    border: "1px solid #eadbdd",
  },

  modalInfoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    marginBottom: "20px",
  },

  modalInfoBox: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "14px",
    background: "#ffffff",
    border: "1px solid #eadbdd",
    borderRadius: "10px",
  },

  modalInfoLabel: {
    fontSize: "12px",
    color: "#806c72",
    fontWeight: "600",
  },

  modalBadge: {
    width: "fit-content",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
  },

  modalStatusBadge: {
    width: "fit-content",
    padding: "5px 10px",
    borderRadius: "20px",
    background: "#e8f5eb",
    color: "#28733d",
    fontSize: "11px",
    fontWeight: "700",
  },

  modalDate: {
    color: "#30262a",
    fontSize: "14px",
    fontWeight: "600",
  },

  issueId: {
    padding: "10px 12px",
    background: "#faf5f6",
    borderRadius: "8px",
    color: "#702f43",
    fontSize: "12px",
    fontFamily: "monospace",
    wordBreak: "break-all",
  },

  modalWorkload: {
    padding: "12px",
    background: "#faf5f6",
    borderRadius: "9px",
  },

  modalWorkloadHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "7px",
    color: "#806c72",
    fontSize: "12px",
  },

  modalWorkloadBackground: {
    width: "100%",
    height: "7px",
    background: "#f0e3e6",
    borderRadius: "10px",
    overflow: "hidden",
  },

  modalWorkloadBar: {
    height: "100%",
    borderRadius: "10px",
    background: "linear-gradient(90deg, #702f43, #b85b78)",
  },

  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "16px 25px",
    borderTop: "1px solid #eee0e4",
  },

  modalCloseButton: {
    padding: "10px 22px",
    borderRadius: "9px",
    border: "none",
    background: "linear-gradient(135deg, #702f43, #8d4059)",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
  },
};


export default TeamPage;
