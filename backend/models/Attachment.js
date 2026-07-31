const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
    },

    size: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Attachment",
  attachmentSchema
);