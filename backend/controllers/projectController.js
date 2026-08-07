const Project = require("../models/Project");

// ================================
// CREATE PROJECT
// ================================

exports.createProject = async (req, res) => {
  try {
    const { projectName, description } = req.body;

    if (!projectName) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      projectName,
      description,
      createdBy: req.user.id,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ================================
// GET ALL PROJECTS OF LOGGED-IN USER
// ================================
exports.getProjects = async (req, res) => {
  try {
    console.log("Logged in user:", req.user);

    const projects = await Project.find({
      createdBy: req.user.id,
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    console.log("Projects found:", projects.length);

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ================================
// GET SINGLE PROJECT
// ================================

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    }).populate("createdBy", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};