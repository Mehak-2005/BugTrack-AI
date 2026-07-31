const Activity = require("../models/Activity");
const Issue = require("../models/Issue");

// =====================================================
// GET ALL ACTIVITY HISTORY FOR LOGGED-IN USER
// GET /api/activities
// =====================================================

exports.getAllActivities = async (req, res) => {
  try {
    // Get all activities performed by the logged-in user.
    // This also allows activities for deleted issues
    // because deleted issue activities can have issue: null.
    const activities = await Activity.find({
      user: req.user.id,
    })
      .populate("user", "name email")
      .populate(
        "issue",
        "title status priority severity category"
      )
      .sort({ createdAt: -1 });

    res.status(200).json(activities);
  } catch (error) {
    console.error(
      "Get all activity history error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch activity history",
      error: error.message,
    });
  }
};

// =====================================================
// GET ACTIVITY HISTORY FOR ONE ISSUE
// GET /api/activities/:issueId
// =====================================================

exports.getIssueActivities = async (req, res) => {
  try {
    const { issueId } = req.params;

    // Make sure the issue exists and belongs
    // to the logged-in user
    const issue = await Issue.findOne({
      _id: issueId,
      reportedBy: req.user.id,
    });

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    // Get activities for this issue
    const activities = await Activity.find({
      issue: issueId,
      user: req.user.id,
    })
      .populate("user", "name email")
      .populate(
        "issue",
        "title status priority severity category"
      )
      .sort({ createdAt: -1 });

    res.status(200).json(activities);
  } catch (error) {
    console.error(
      "Get activity history error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch activity history",
      error: error.message,
    });
  }
};