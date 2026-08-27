const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/commentController");

// ==========================================
// ADD COMMENT
// POST /api/comments/:issueId
// ==========================================

/**
 * @swagger
 * /api/comments/{issueId}:
 *   post:
 *     summary: Add a comment to an issue
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: issueId
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
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: The issue has been investigated and is being fixed.
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Invalid comment data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Issue not found
 *       500:
 *         description: Server error
 */

router.post("/:issueId", auth, addComment);

// ==========================================
// GET COMMENTS
// GET /api/comments/:issueId
// ==========================================

/**
 * @swagger
 * /api/comments/{issueId}:
 *   get:
 *     summary: Get all comments for an issue
 *     tags:
 *       - Comments
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
 *         description: Comments retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Issue not found
 *       500:
 *         description: Server error
 */

router.get("/:issueId", auth, getComments);

// ==========================================
// DELETE COMMENT
// DELETE /api/comments/:commentId
// ==========================================

/**
 * @swagger
 * /api/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */

router.delete("/:commentId", auth, deleteComment);

module.exports = router;