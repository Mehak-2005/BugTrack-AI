const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    // Issue connected to this activity.
    // It can be null when the issue has been deleted.
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      default: null,
    },

    // Keeps the issue title even after the issue is deleted.
    issueTitle: {
      type: String,
      trim: true,
      default: "",
    },

    // User who performed the activity.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Example:
    // "Status changed"
    // "Priority changed"
    // "Comment added"
    // "Attachment uploaded"
    // "Issue deleted"
    action: {
      type: String,
      required: true,
      trim: true,
    },

    // Description of what happened.
    details: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Activity",
  activitySchema
);