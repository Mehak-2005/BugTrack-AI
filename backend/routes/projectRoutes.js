const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  createProject,
  getProjects,
  getProjectById,
} = require("../controllers/projectController");

// Create project
router.post("/", auth, createProject);

// Get all projects
router.get("/", auth, getProjects);

// Get single project
router.get("/:id", auth, getProjectById);

module.exports = router;