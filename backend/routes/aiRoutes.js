const express = require("express");

const router = express.Router();

const {
  generateAIReport,
  analyzeBug,
} = require("../controllers/aiController");

const authMiddleware = require("../middleware/authMiddleware");

// ==========================================
// GENERATE AI BUG REPORT
// POST /api/ai/generate-bug-report
// ==========================================

router.post(
  "/generate-bug-report",
  authMiddleware,
  generateAIReport
);

// ==========================================
// AI BUG TRIAGE
// POST /api/ai/triage
// ==========================================

router.post(
  "/triage",
  authMiddleware,
  analyzeBug
);

module.exports = router;