const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/commentController");

// Add comment to issue
router.post("/:issueId", auth, addComment);

// Get comments for issue
router.get("/:issueId", auth, getComments);

// Delete comment
router.delete("/:commentId", auth, deleteComment);

module.exports = router;