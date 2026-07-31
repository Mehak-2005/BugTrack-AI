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
    fileSize: 5 * 1024 * 1024, // 5 MB
  },

  fileFilter,
});

// ==========================================
// ROUTES
// ==========================================

// Upload file
router.post(
  "/:issueId",
  auth,
  upload.single("file"),
  uploadAttachment
);

// Get files belonging to an issue
router.get(
  "/:issueId",
  auth,
  getAttachments
);

// Delete attachment
router.delete(
  "/file/:attachmentId",
  auth,
  deleteAttachment
);

module.exports = router;