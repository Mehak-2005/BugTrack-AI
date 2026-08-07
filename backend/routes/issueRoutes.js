const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createIssue,
  getIssues,
  updateIssue,
  deleteIssue,
  saveIssue,
  getSavedIssues,
} = require("../controllers/issueController");


// =========================================
// CREATE ISSUE
// =========================================
router.post("/", authMiddleware, createIssue);

// =========================================
// GET ALL ISSUES OF LOGGED-IN USER
// =========================================
router.get("/", authMiddleware, getIssues);

// =========================================
// SAVE ISSUE
// =========================================
router.post("/save", authMiddleware, saveIssue);

// =========================================
// GET SAVED ISSUES
// =========================================
router.get("/saved", authMiddleware, getSavedIssues);

// =========================================
// UPDATE ISSUE
// =========================================
router.put("/:id", authMiddleware, updateIssue);

// =========================================
// DELETE ISSUE
// =========================================
router.delete("/:id", authMiddleware, deleteIssue);

module.exports = router;