const mongoose = require("mongoose");

// ========================================
// ASSIGNED TASK SCHEMA
// ========================================

const assignedTaskSchema = new mongoose.Schema(
  {
    // ========================================
    // RELATED ISSUE
    // ========================================

    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },

    // ========================================
    // ISSUE TITLE
    // ========================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    // ========================================
    // ISSUE PRIORITY
    // ========================================

    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
        "Critical",
      ],
      default: "Medium",
    },

    // ========================================
    // TASK STATUS
    // ========================================

    status: {
      type: String,
      enum: [
        "Open",
        "In Progress",
        "In Review",
        "Resolved",
      ],
      default: "Open",
    },

    // ========================================
    // ASSIGNED DATE
    // ========================================

    assignedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  }
);

// ========================================
// TEAM MEMBER SCHEMA
// ========================================

const teamMemberSchema = new mongoose.Schema(
  {
    // ========================================
    // OWNER OF THIS TEAM
    // ========================================

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ========================================
    // MEMBER NAME
    // ========================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    // ========================================
    // MEMBER ROLE
    // ========================================

    role: {
      type: String,
      enum: [
        "Developer",
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "Tester",
        "QA Engineer",
        "UI/UX Designer",
        "DevOps Engineer",
        "Data Scientist",
        "Project Manager",
        "Team Lead",
        "Product Manager",
      ],
      required: true,
    },

    // ========================================
    // SKILLS
    // ========================================

    skills: {
      type: [String],
      default: [],
    },

    // ========================================
    // EXPERIENCE
    // ========================================

    experience: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ========================================
    // CURRENT WORKLOAD
    // ========================================

    workload: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ========================================
    // EMAIL
    // ========================================

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // ========================================
    // ASSIGNED TASKS
    // ========================================

    assignedTasks: {
      type: [assignedTaskSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// ========================================
// EXPORT MODEL
// ========================================

module.exports = mongoose.model(
  "TeamMember",
  teamMemberSchema
);