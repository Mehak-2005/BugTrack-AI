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

/**
 * @swagger
 * /api/team:
 *   get:
 *     summary: Get all team members
 *     tags:
 *       - Team
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Team members retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.get("/", authMiddleware, getTeamMembers);

// ========================================
// ADD TEAM MEMBER
// ========================================

/**
 * @swagger
 * /api/team:
 *   post:
 *     summary: Add a new team member
 *     tags:
 *       - Team
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Priya Sharma
 *               email:
 *                 type: string
 *                 example: priya@example.com
 *               role:
 *                 type: string
 *                 example: Backend Developer
 *     responses:
 *       201:
 *         description: Team member added successfully
 *       400:
 *         description: Invalid team member data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.post("/", authMiddleware, addTeamMember);

// ========================================
// DELETE TEAM MEMBER
// ========================================

/**
 * @swagger
 * /api/team/{id}:
 *   delete:
 *     summary: Delete a team member
 *     tags:
 *       - Team
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team member ID
 *     responses:
 *       200:
 *         description: Team member deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Team member not found
 *       500:
 *         description: Server error
 */

router.delete("/:id", authMiddleware, deleteTeamMember);

// ========================================
// ASSIGN ISSUE TO TEAM MEMBER
// ========================================

/**
 * @swagger
 * /api/team/{id}/assign:
 *   post:
 *     summary: Assign an issue to a team member
 *     tags:
 *       - Team
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team member ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               issueId:
 *                 type: string
 *                 example: 66a123456789abcdef123456
 *     responses:
 *       200:
 *         description: Issue assigned successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Team member or issue not found
 */

router.post(
  "/:id/assign",
  authMiddleware,
  assignIssueToTeamMember
);

// ========================================
// UPDATE ASSIGNED TASK STATUS
// ========================================

/**
 * @swagger
 * /api/team/{id}/task-status:
 *   put:
 *     summary: Update assigned task status
 *     tags:
 *       - Team
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team member ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               issueId:
 *                 type: string
 *                 example: 66a123456789abcdef123456
 *               status:
 *                 type: string
 *                 example: In Progress
 *     responses:
 *       200:
 *         description: Task status updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Team member or task not found
 */

router.put(
  "/:id/task-status",
  authMiddleware,
  updateAssignedTaskStatus
);

module.exports = router;