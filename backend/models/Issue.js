const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    // ========================================
    // ISSUE TITLE
    // ========================================
    title: {
      type: String,
      trim: true,
    },

    // ========================================
    // ISSUE DESCRIPTION
    // ========================================
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // ========================================
    // AI GENERATED REPORT
    // ========================================
    report: {
      type: String,
    },

    // ========================================
    // ISSUE STATUS
    // ========================================
    status: {
      type: String,
      enum: [
        "Open",
        "In Progress",
        "In Review",
        "Resolved",
        "Closed",
      ],
      default: "Open",
    },

    // ========================================
    // PRIORITY
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
    // PROJECT
    // ========================================
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    // ========================================
    // SPRINT
    // ========================================
    sprint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sprint",
      default: null,
    },

    // ========================================
    // SEVERITY
    // ========================================
    severity: {
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
    // ISSUE CATEGORY
    // ========================================
    category: {
      type: String,
      enum: [
        "UI",
        "Authentication",
        "Backend",
        "Database",
        "API",
        "Performance",
        "Security",
        "Navigation",
        "Checkout",
        "Other",
      ],
      default: "Other",
    },

    // ========================================
    // USER WHO REPORTED THE ISSUE
    // ========================================
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ========================================
    // SEMANTIC SEARCH EMBEDDING
    // ========================================
    // Stores the vector representation of the
    // issue description for duplicate detection.
    embedding: {
      type: [Number],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Issue", issueSchema);