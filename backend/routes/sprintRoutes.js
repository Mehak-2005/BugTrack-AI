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

router.get("/", authMiddleware, getSprints);

// =========================================
// CREATE SPRINT
// =========================================

router.post("/", authMiddleware, createSprint);

// =========================================
// UPDATE SPRINT
// =========================================

router.put("/:id", authMiddleware, updateSprint);

// =========================================
// DELETE SPRINT
// =========================================

router.delete("/:id", authMiddleware, deleteSprint);

module.exports = router;