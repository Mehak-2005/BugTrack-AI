const express = require("express");

const router = express.Router();

const {
  getSprints,
  createSprint,
  updateSprint,
  deleteSprint,
} = require("../controllers/sprintController");

const authMiddleware = require("../middleware/authMiddleware");

// =========================================
// GET ALL SPRINTS
// =========================================

/**
 * @swagger
 * /api/sprints:
 *   get:
 *     summary: Get all sprints
 *     tags:
 *       - Sprints
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sprints retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.get("/", authMiddleware, getSprints);

// =========================================
// CREATE SPRINT
// =========================================

/**
 * @swagger
 * /api/sprints:
 *   post:
 *     summary: Create a new sprint
 *     tags:
 *       - Sprints
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sprint 1
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-27
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-09-10
 *     responses:
 *       201:
 *         description: Sprint created successfully
 *       400:
 *         description: Invalid sprint data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.post("/", authMiddleware, createSprint);

// =========================================
// UPDATE SPRINT
// =========================================

/**
 * @swagger
 * /api/sprints/{id}:
 *   put:
 *     summary: Update a sprint
 *     tags:
 *       - Sprints
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sprint ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sprint updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sprint not found
 *       500:
 *         description: Server error
 */

router.put("/:id", authMiddleware, updateSprint);

// =========================================
// DELETE SPRINT
// =========================================

/**
 * @swagger
 * /api/sprints/{id}:
 *   delete:
 *     summary: Delete a sprint
 *     tags:
 *       - Sprints
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sprint ID
 *     responses:
 *       200:
 *         description: Sprint deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sprint not found
 *       500:
 *         description: Server error
 */

router.delete("/:id", authMiddleware, deleteSprint);

module.exports = router;