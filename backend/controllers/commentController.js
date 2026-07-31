const Comment = require("../models/Comment");
const Issue = require("../models/Issue");
const Activity = require("../models/Activity");

// ==========================================
// ADD COMMENT
// POST /api/comments/:issueId
// ==========================================

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { issueId } = req.params;

    // ======================================
    // VALIDATE COMMENT
    // ======================================

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    // ======================================
    // CHECK ISSUE
    // ======================================

    // Make sure the issue exists and belongs
    // to the currently logged-in user.
    const issue = await Issue.findOne({
      _id: issueId,
      reportedBy: req.user.id,
    });

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    // ======================================
    // CREATE COMMENT
    // ======================================

    const comment = await Comment.create({
      issue: issueId,
      user: req.user.id,
      text: text.trim(),
    });

    await comment.populate(
      "user",
      "name email"
    );

    // ======================================
    // CREATE ACTIVITY
    // ======================================

    try {
      await Activity.create({
        issue: issueId,
        user: req.user.id,
        action: "Comment added",
        details: `Added comment: "${text.trim()}"`,
      });
    } catch (activityError) {
      console.error(
        "Comment activity creation error:",
        activityError
      );
    }

    // ======================================
    // RESPONSE
    // ======================================

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error(
      "Add comment error:",
      error
    );

    res.status(500).json({
      message: "Failed to add comment",
      error: error.message,
    });
  }
};

// ==========================================
// GET COMMENTS FOR AN ISSUE
// GET /api/comments/:issueId
// ==========================================

exports.getComments = async (req, res) => {
  try {
    const { issueId } = req.params;

    // ======================================
    // CHECK ISSUE
    // ======================================

    const issue = await Issue.findOne({
      _id: issueId,
      reportedBy: req.user.id,
    });

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    // ======================================
    // GET COMMENTS
    // ======================================

    const comments = await Comment.find({
      issue: issueId,
    })
      .populate("user", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error(
      "Get comments error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE COMMENT
// DELETE /api/comments/:commentId
// ==========================================

exports.deleteComment = async (req, res) => {
  try {
    const comment =
      await Comment.findOneAndDelete({
        _id: req.params.commentId,
        user: req.user.id,
      });

    if (!comment) {
      return res.status(404).json({
        message:
          "Comment not found or you cannot delete this comment",
      });
    }

    res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete comment error:",
      error
    );

    res.status(500).json({
      message: "Failed to delete comment",
      error: error.message,
    });
  }
};