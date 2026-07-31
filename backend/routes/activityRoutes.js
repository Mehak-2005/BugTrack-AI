const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  getAllActivities,
  getIssueActivities,
} = require("../controllers/activityController");

// =====================================================
// GET ALL ACTIVITIES
// GET /api/activities
// =====================================================

router.get(
  "/",
  auth,
  getAllActivities
);

// =====================================================
// GET ACTIVITIES OF ONE ISSUE
// GET /api/activities/:issueId
// =====================================================

router.get(
  "/:issueId",
  auth,
  getIssueActivities
);

module.exports = router;