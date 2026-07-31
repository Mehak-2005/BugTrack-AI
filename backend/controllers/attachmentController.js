const fs = require("fs");
const path = require("path");

const Attachment = require("../models/Attachment");
const Issue = require("../models/Issue");
const Activity = require("../models/Activity");

// ==========================================
// UPLOAD ATTACHMENT
// POST /api/attachments/:issueId
// ==========================================

exports.uploadAttachment = async (req, res) => {
  try {
    const { issueId } = req.params;

    const issue = await Issue.findOne({
      _id: issueId,
      reportedBy: req.user.id,
    });

    if (!issue) {
      if (req.file?.path) {
        fs.unlink(req.file.path, () => {});
      }

      return res.status(404).json({
        message: "Issue not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please select a file",
      });
    }

    const attachment = await Attachment.create({
      issue: issueId,
      uploadedBy: req.user.id,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: `/uploads/${req.file.filename}`,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });

    await attachment.populate(
      "uploadedBy",
      "name email"
    );

    await attachment.populate(
  "uploadedBy",
  "name email"
);

// ADD THIS ↓↓↓

try {
  await Activity.create({
    issue: issueId,
    user: req.user.id,
    action: "Attachment uploaded",
    details: `Uploaded attachment: "${req.file.originalname}"`,
  });
} catch (activityError) {
  console.error(
    "Attachment upload activity error:",
    activityError
  );
}

// Your existing response stays below
res.status(201).json({
  message: "File uploaded successfully",
  attachment,
});

    res.status(201).json({
      message: "File uploaded successfully",
      attachment,
    });
  } catch (error) {
    console.error("Upload attachment error:", error);

    res.status(500).json({
      message: "Failed to upload file",
      error: error.message,
    });
  }
};

// ==========================================
// GET ISSUE ATTACHMENTS
// GET /api/attachments/:issueId
// ==========================================

exports.getAttachments = async (req, res) => {
  try {
    const { issueId } = req.params;

    const issue = await Issue.findOne({
      _id: issueId,
      reportedBy: req.user.id,
    });

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    const attachments = await Attachment.find({
      issue: issueId,
    })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(attachments);
  } catch (error) {
    console.error("Get attachments error:", error);

    res.status(500).json({
      message: "Failed to fetch attachments",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE ATTACHMENT
// DELETE /api/attachments/file/:attachmentId
// ==========================================

exports.deleteAttachment = async (req, res) => {
  try {
    const attachment = await Attachment.findOne({
      _id: req.params.attachmentId,
      uploadedBy: req.user.id,
    });

    if (!attachment) {
      return res.status(404).json({
        message:
          "Attachment not found or you cannot delete it",
      });
    }

     // Save information before deleting it
    const issueId = attachment.issue;
    const originalName = attachment.originalName;
    const fileName = attachment.fileName;

    // ======================================
    // DELETE ATTACHMENT FROM DATABASE
    // =================================

    await Attachment.deleteOne({
      _id: attachment._id,
    });

    const storedPath = path.join(
      __dirname,
      "..",
      "uploads",
      attachment.fileName
    );

    fs.unlink(storedPath, (error) => {
      if (error && error.code !== "ENOENT") {
        console.error(
          "Failed to delete stored file:",
          error
        );
      }
    });
     // ======================================
    // CREATE ACTIVITY HISTORY
    // ======================================

    try {
      await Activity.create({
        issue: issueId,
        user: req.user.id,
        action: "Attachment deleted",
        details: `Deleted attachment: "${originalName}"`,
      });
    } catch (activityError) {
      console.error(
        "Attachment delete activity error:",
        activityError
      );
    }

    res.status(200).json({
      message: "Attachment deleted successfully",
    });
  } catch (error) {
    console.error("Delete attachment error:", error);

    res.status(500).json({
      message: "Failed to delete attachment",
      error: error.message,
    });
  }
};