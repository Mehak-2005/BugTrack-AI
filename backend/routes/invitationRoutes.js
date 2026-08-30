const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createInvitation,
  verifyInvitation,
  acceptInvitation,
} = require("../controllers/invitationController");

// ========================================
// CREATE PROJECT INVITATION
// ========================================

router.post(
  "/",
  authMiddleware,
  createInvitation
);

// ========================================
// VERIFY INVITATION
// ========================================

router.post(
  "/verify",
  verifyInvitation
);


// ========================================
// ACCEPT INVITATION
// ========================================

router.post(
  "/accept",
  authMiddleware,
  acceptInvitation
);

module.exports = router;