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
      trim:true,
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
  ],
  default: "Open",
},

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
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
 // ISSUE CATEGORY
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
// PROJECT
project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    // USER WHO REPORTED ISSU
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