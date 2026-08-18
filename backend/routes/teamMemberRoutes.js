const express = require("express");

const {
  getTeamMembers,
  addTeamMember,
  assignIssueToTeamMember,
  updateAssignedTaskStatus,
  deleteTeamMember,
} = require("../controllers/teamMemberController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// GET ALL TEAM MEMBERS
// ========================================

router.get(
  "/",
  authMiddleware,
  getTeamMembers
);

// ========================================
// ADD TEAM MEMBER
// ========================================

router.post(
  "/",
  authMiddleware,
  addTeamMember
);

// ========================================
// DELETE TEAM MEMBER
// ========================================

router.delete(
  "/:id",
  authMiddleware,
  deleteTeamMember
);

// ========================================
// ASSIGN ISSUE TO TEAM MEMBER
// ========================================

router.post(
  "/:id/assign",
  authMiddleware,
  assignIssueToTeamMember
);

// ========================================
// UPDATE ASSIGNED TASK STATUS
// ========================================

router.put(
  "/:id/task-status",
  authMiddleware,
  updateAssignedTaskStatus
);

module.exports = router;