const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  createIssue,
  getIssues,
  updateIssue,
  deleteIssue,
  saveIssue,
  getSavedIssues,
} = require("../controllers/issueController");

// Create normal issue
router.post("/", auth, createIssue);

// Get logged-in user's issues
router.get("/", auth, getIssues);

// Saved issue routes MUST come before /:id
router.post("/save", auth, saveIssue);

router.get("/saved", auth, getSavedIssues);

// Update issue
router.put("/:id", auth, updateIssue);

// Delete issue
router.delete("/:id", auth, deleteIssue);

module.exports = router;