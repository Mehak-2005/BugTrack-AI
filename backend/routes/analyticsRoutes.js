const express = require("express");

const router = express.Router();

const {
  getDashboardAnalytics,
  getAIAnalyticsInsights,
} = require("../controllers/analyticsController");

const authMiddleware = require("../middleware/authMiddleware");

// =========================================
// DASHBOARD ANALYTICS
// GET /api/analytics/dashboard
// =========================================

/**
 * @swagger
 * /api/analytics/dashboard:
 *   get:
 *     summary: Get dashboard analytics
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to fetch analytics data
 */

router.get(
  "/dashboard",
  authMiddleware,
  getDashboardAnalytics
);

// =========================================
// AI ANALYTICS INSIGHTS
// GET /api/analytics/insights
// =========================================

/**
 * @swagger
 * /api/analytics/insights:
 *   get:
 *     summary: Generate AI-powered analytics insights
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AI insights generated successfully
 *       401:
 *         description: Unauthorized
 *       503:
 *         description: AI insights are temporarily unavailable
 */

router.get(
  "/insights",
  authMiddleware,
  getAIAnalyticsInsights
);

module.exports = router;