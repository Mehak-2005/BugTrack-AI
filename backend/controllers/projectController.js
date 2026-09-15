const Project = require("../models/Project");
const TeamMember = require("../models/TeamMember");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

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

    // Generate a unique shared passkey for the project (e.g. PROJ-A9F2)
    const passkey = "PROJ-" + crypto.randomBytes(3).toString("hex").toUpperCase();

    const project = await Project.create({
      projectName: projectName.trim(),
      description: description?.trim() || "",
      createdBy: req.user.id,
      passkey,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
      passkey,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ================================
// JOIN PROJECT VIA PASSKEY & MEMBER VERIFICATION
// ================================
exports.joinProject = async (req, res) => {
  try {
    const { passkey, memberName } = req.body;

    if (!passkey || !memberName) {
      return res.status(400).json({
        success: false,
        message: "Passkey and member name are required",
      });
    }

    // Find the project matching the passkey
    const project = await Project.findOne({ passkey: passkey.trim().toUpperCase() });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Invalid passkey. Project not found.",
      });
    }

    // Check if the team member exists in the TeamMember collection for this project
    const teamMember = await TeamMember.findOne({
      project: project._id,
      name: { $regex: new RegExp(`^${memberName.trim()}$`, "i") },
    });

    if (!teamMember) {
      return res.status(403).json({
        success: false,
        message: `Access denied. '${memberName}' is not authorized as a team member for this project.`,
      });
    }

    // Generate JWT token so the team member's dashboard loads their specific context
    const token = jwt.sign(
      {
        id: project.createdBy, // Bind to the Team Lead's user ID so standard queries work seamlessly
        teamMemberId: teamMember._id,
        projectId: project._id,
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    teamMember.joined = true;
    await teamMember.save();

    res.status(200).json({
      success: true,
      message: `Welcome back, ${memberName}! Accessing workspace dashboard.`,
      token,
      project,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ================================
// GET ALL PROJECTS OF LOGGED-IN USER
// ================================
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      createdBy: req.user.id,
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

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