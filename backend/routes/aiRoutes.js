const express = require("express");

const router = express.Router();

const {
  generateAIReport,
  analyzeBug,
  analyzeResolution,
  generateTests,
  recommendDeveloper,
  verifyResolution,
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


// ==========================================
// AI RESOLUTION ASSISTANCE
// POST /api/ai/analyze-resolution/:issueId
// ==========================================

router.post(
  "/analyze-resolution/:issueId",
  authMiddleware,
  analyzeResolution
);

// ==========================================
// AI TEST-CASE GENERATION
// POST /api/ai/generate-tests/:issueId
// ==========================================

router.post(
  "/generate-tests/:issueId",
  authMiddleware,
  generateTests
);

// ==========================================
// AI DEVELOPER RECOMMENDATION
// POST /api/ai/recommend-developer/:issueId
// ==========================================

router.post(
  "/recommend-developer/:issueId",
  authMiddleware,
  recommendDeveloper
);
// ==========================================
// AI RESOLUTION VERIFICATION
// POST /api/ai/verify-resolution/:issueId
// ==========================================

router.post(
  "/verify-resolution/:issueId",
  authMiddleware,
  verifyResolution
);

module.exports = router;