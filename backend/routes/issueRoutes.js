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
  semanticSearch,
  getAnalytics,
  getDeveloperWorkload,
  getDefectTrends,
  getAverageResolutionTime,
} = require("../controllers/issueController");

// =========================================
// GET ANALYTICS
// =========================================

/**
 * @swagger
 * /api/issues/analytics:
 *   get:
 *     summary: Get issue analytics
 *     tags:
 *       - Issues
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Issue analytics retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/analytics", authMiddleware, getAnalytics);

/**
 * @swagger
 * /api/issues/analytics/developer-workload:
 *   get:
 *     summary: Get developer workload analytics
 *     tags:
 *       - Issues
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Developer workload retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/analytics/developer-workload",
  authMiddleware,
  getDeveloperWorkload
);

/**
 * @swagger
 * /api/issues/analytics/trends:
 *   get:
 *     summary: Get defect trends
 *     tags:
 *       - Issues
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Defect trends retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/analytics/trends",
  authMiddleware,
  getDefectTrends
);

/**
 * @swagger
 * /api/issues/analytics/resolution-time:
 *   get:
 *     summary: Get average issue resolution time
 *     tags:
 *       - Issues
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Average resolution time retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/analytics/resolution-time",
  authMiddleware,
  getAverageResolutionTime
);

// =========================================
// CREATE ISSUE
// =========================================

/**
 * @swagger
 * /api/issues:
 *   post:
 *     summary: Create a new issue
 *     tags:
 *       - Issues
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: Login page crashes
 *               description:
 *                 type: string
 *                 example: Application crashes when the user clicks login
 *               priority:
 *                 type: string
 *                 example: High
 *               status:
 *                 type: string
 *                 example: Open
 *               project:
 *                 type: string
 *                 example: 66a123456789abcdef123456
 *     responses:
 *       201:
 *         description: Issue created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware, createIssue);

// =========================================
// GET ALL ISSUES
// =========================================

/**
 * @swagger
 * /api/issues:
 *   get:
 *     summary: Get all issues of the logged-in user
 *     tags:
 *       - Issues
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Issues retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, getIssues);

// =========================================
// SAVE ISSUE
// =========================================

/**
 * @swagger
 * /api/issues/save:
 *   post:
 *     summary: Save an issue
 *     tags:
 *       - Issues
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Issue saved successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/save", authMiddleware, saveIssue);

// =========================================
// GET SAVED ISSUES
// =========================================

/**
 * @swagger
 * /api/issues/saved:
 *   get:
 *     summary: Get all saved issues
 *     tags:
 *       - Issues
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saved issues retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/saved", authMiddleware, getSavedIssues);

// =========================================
// UPDATE ISSUE
// =========================================

/**
 * @swagger
 * /api/issues/{id}:
 *   put:
 *     summary: Update an issue
 *     tags:
 *       - Issues
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Issue ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Issue updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Issue not found
 */
router.put("/:id", authMiddleware, updateIssue);

// =========================================
// DELETE ISSUE
// =========================================

/**
 * @swagger
 * /api/issues/{id}:
 *   delete:
 *     summary: Delete an issue
 *     tags:
 *       - Issues
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Issue ID
 *     responses:
 *       200:
 *         description: Issue deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Issue not found
 */
router.delete("/:id", authMiddleware, deleteIssue);

// =========================================
// SEMANTIC SEARCH
// =========================================

/**
 * @swagger
 * /api/issues/semantic-search:
 *   get:
 *     summary: Search issues using semantic search
 *     tags:
 *       - Issues
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *       400:
 *         description: Search query is required
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/semantic-search",
  authMiddleware,
  semanticSearch
);

module.exports = router;