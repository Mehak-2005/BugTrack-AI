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

/**
 * @swagger
 * /api/ai/generate-bug-report:
 *   post:
 *     summary: Generate an AI-powered bug report
 *     tags:
 *       - AI Features
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Login page error
 *               description:
 *                 type: string
 *                 example: Application crashes when the user clicks the login button
 *     responses:
 *       200:
 *         description: AI bug report generated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: AI service or server error
 */

router.post(
  "/generate-bug-report",
  authMiddleware,
  generateAIReport
);

// ==========================================
// AI BUG TRIAGE
// POST /api/ai/triage
// ==========================================

/**
 * @swagger
 * /api/ai/triage:
 *   post:
 *     summary: Analyze and triage a bug using AI
 *     tags:
 *       - AI Features
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Payment failure
 *               description:
 *                 type: string
 *                 example: Payment is not processed successfully
 *     responses:
 *       200:
 *         description: Bug triage completed successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: AI service or server error
 */

router.post(
  "/triage",
  authMiddleware,
  analyzeBug
);

// ==========================================
// AI RESOLUTION ASSISTANCE
// POST /api/ai/analyze-resolution/:issueId
// ==========================================

/**
 * @swagger
 * /api/ai/analyze-resolution/{issueId}:
 *   post:
 *     summary: Analyze and suggest a resolution for an issue
 *     tags:
 *       - AI Features
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: issueId
 *         required: true
 *         schema:
 *           type: string
 *         description: Issue ID
 *     responses:
 *       200:
 *         description: AI resolution analysis completed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Issue not found
 *       500:
 *         description: AI service or server error
 */

router.post(
  "/analyze-resolution/:issueId",
  authMiddleware,
  analyzeResolution
);

// ==========================================
// AI TEST-CASE GENERATION
// POST /api/ai/generate-tests/:issueId
// ==========================================

/**
 * @swagger
 * /api/ai/generate-tests/{issueId}:
 *   post:
 *     summary: Generate test cases for an issue using AI
 *     tags:
 *       - AI Features
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: issueId
 *         required: true
 *         schema:
 *           type: string
 *         description: Issue ID
 *     responses:
 *       200:
 *         description: Test cases generated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Issue not found
 *       500:
 *         description: AI service or server error
 */

router.post(
  "/generate-tests/:issueId",
  authMiddleware,
  generateTests
);

// ==========================================
// AI DEVELOPER RECOMMENDATION
// POST /api/ai/recommend-developer/:issueId
// ==========================================

/**
 * @swagger
 * /api/ai/recommend-developer/{issueId}:
 *   post:
 *     summary: Recommend a suitable developer for an issue
 *     tags:
 *       - AI Features
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: issueId
 *         required: true
 *         schema:
 *           type: string
 *         description: Issue ID
 *     responses:
 *       200:
 *         description: Developer recommendation generated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Issue not found
 *       500:
 *         description: AI service or server error
 */

router.post(
  "/recommend-developer/:issueId",
  authMiddleware,
  recommendDeveloper
);

// ==========================================
// AI RESOLUTION VERIFICATION
// POST /api/ai/verify-resolution/:issueId
// ==========================================

/**
 * @swagger
 * /api/ai/verify-resolution/{issueId}:
 *   post:
 *     summary: Verify whether an issue resolution is complete
 *     tags:
 *       - AI Features
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: issueId
 *         required: true
 *         schema:
 *           type: string
 *         description: Issue ID
 *     responses:
 *       200:
 *         description: Resolution verification completed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Issue not found
 *       500:
 *         description: AI service or server error
 */

router.post(
  "/verify-resolution/:issueId",
  authMiddleware,
  verifyResolution
);

module.exports = router;