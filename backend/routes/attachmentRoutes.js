const express = require("express");

const multer = require("multer");

const path = require("path");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  uploadAttachment,
  getAttachments,
  deleteAttachment,
} = require("../controllers/attachmentController");

// ==========================================
// MULTER STORAGE
// ==========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

// ==========================================
// FILE FILTER
// ==========================================

const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "application/pdf",
    "text/plain",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PNG, JPG, WEBP, PDF and TXT files are allowed"
      ),
      false
    );
  }
};

// ==========================================
// MULTER CONFIGURATION
// ==========================================

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter,
});

// ==========================================
// UPLOAD ATTACHMENT
// POST /api/attachments/:issueId
// ==========================================

/**
 * @swagger
 * /api/attachments/{issueId}:
 *   post:
 *     summary: Upload an attachment for an issue
 *     tags:
 *       - Attachments
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: PNG, JPG, WEBP, PDF or TXT file (maximum 5 MB)
 *     responses:
 *       201:
 *         description: Attachment uploaded successfully
 *       400:
 *         description: Invalid file or file size exceeds limit
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Issue not found
 *       500:
 *         description: Server error
 */

router.post(
  "/:issueId",
  auth,
  upload.single("file"),
  uploadAttachment
);

// ==========================================
// GET ATTACHMENTS
// GET /api/attachments/:issueId
// ==========================================

/**
 * @swagger
 * /api/attachments/{issueId}:
 *   get:
 *     summary: Get all attachments for an issue
 *     tags:
 *       - Attachments
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
 *         description: Attachments retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Issue not found
 *       500:
 *         description: Server error
 */

router.get(
  "/:issueId",
  auth,
  getAttachments
);

// ==========================================
// DELETE ATTACHMENT
// DELETE /api/attachments/file/:attachmentId
// ==========================================

/**
 * @swagger
 * /api/attachments/file/{attachmentId}:
 *   delete:
 *     summary: Delete an attachment
 *     tags:
 *       - Attachments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Attachment ID
 *     responses:
 *       200:
 *         description: Attachment deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Attachment not found
 *       500:
 *         description: Server error
 */

router.delete(
  "/file/:attachmentId",
  auth,
  deleteAttachment
);

module.exports = router;