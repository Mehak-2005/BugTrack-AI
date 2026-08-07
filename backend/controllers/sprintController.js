const Sprint = require("../models/Sprint");

// ========================================
// GET ALL SPRINTS
// ========================================

exports.getSprints = async (req, res) => {
  try {
    const sprints = await Sprint.find()
      .populate("project", "projectName")
      .sort({ createdAt: -1 });

    res.status(200).json(sprints);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch sprints",
    });
  }
};

// ========================================
// CREATE SPRINT
// ========================================

exports.createSprint = async (req, res) => {
  try {
    const sprint = await Sprint.create(req.body);

    res.status(201).json(sprint);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to create sprint",
    });
  }
};

// ========================================
// UPDATE SPRINT
// ========================================

exports.updateSprint = async (req, res) => {
  try {
    const sprint = await Sprint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(sprint);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to update sprint",
    });
  }
};

// ========================================
// DELETE SPRINT
// ========================================

exports.deleteSprint = async (req, res) => {
  try {
    await Sprint.findByIdAndDelete(req.params.id);

    res.json({
      message: "Sprint deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to delete sprint",
    });
  }
};