const Sprint = require("../models/Sprint");

// ========================================
// GET ALL SPRINTS
// ========================================

exports.getSprints = async (req, res) => {
  try {
    const sprints = await Sprint.find({
      createdBy: req.user.id,
    })
      .populate("project", "projectName")
      .sort({ createdAt: -1 });

    res.status(200).json(sprints);
  } catch (err) {
    console.error("Get sprints error:", err);

    res.status(500).json({
      message: "Failed to fetch sprints",
      error: err.message,
    });
  }
};

// ========================================
// CREATE SPRINT
// ========================================

exports.createSprint = async (req, res) => {
  try {
    const sprint = await Sprint.create({
      ...req.body,
      createdBy: req.user.id,
    });

    const populatedSprint = await Sprint.findById(sprint._id)
      .populate("project", "projectName")
      .populate("createdBy", "name email");

    res.status(201).json(populatedSprint);
  } catch (err) {
    console.error("Create sprint error:", err);

    res.status(500).json({
      message: "Failed to create sprint",
      error: err.message,
    });
  }
};

// ========================================
// UPDATE SPRINT
// ========================================

exports.updateSprint = async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      project,
    } = req.body;

    const sprint = await Sprint.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user.id,
      },
      {
        name,
        description,
        startDate,
        endDate,
        project,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("project", "projectName")
      .populate("createdBy", "name email");

    if (!sprint) {
      return res.status(404).json({
        message: "Sprint not found",
      });
    }

    res.status(200).json(sprint);
  } catch (err) {
    console.error("Update sprint error:", err);

    res.status(500).json({
      message: "Failed to update sprint",
      error: err.message,
    });
  }
};

// ========================================
// DELETE SPRINT
// ========================================

exports.deleteSprint = async (req, res) => {
  try {
    const sprint = await Sprint.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!sprint) {
      return res.status(404).json({
        message: "Sprint not found",
      });
    }

    res.status(200).json({
      message: "Sprint deleted successfully",
    });
  } catch (err) {
    console.error("Delete sprint error:", err);

    res.status(500).json({
      message: "Failed to delete sprint",
      error: err.message,
    });
  }
};