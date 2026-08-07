const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    report: {
      type: String,
    },

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

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    // Sprint assigned to this issue
    sprint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sprint",
      default: null,
    },

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

    // Issue Category
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

    // User who reported the issue
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Issue", issueSchema);