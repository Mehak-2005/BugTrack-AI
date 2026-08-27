const Issue = require("../models/Issue");
const TeamMember = require("../models/TeamMember");
const {
  generateAnalyticsInsights,
} = require("../services/geminiService");
const mongoose = require("mongoose");

// =====================================================
// GET ANALYTICS DASHBOARD DATA
// GET /api/analytics/dashboard
// =====================================================

exports.getDashboardAnalytics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // ========================================
    // SUMMARY
    // ========================================

    const totalDefects = await Issue.countDocuments({
      reportedBy: userId,
    });

    const openDefects = await Issue.countDocuments({
      reportedBy: userId,
      status: "Open",
    });

    const inProgressDefects = await Issue.countDocuments({
      reportedBy: userId,
      status: "In Progress",
    });

    const inReviewDefects = await Issue.countDocuments({
      reportedBy: userId,
      status: "In Review",
    });

    const resolvedDefects = await Issue.countDocuments({
      reportedBy: userId,
      status: "Resolved",
    });
    const closedDefects = await Issue.countDocuments({
  reportedBy: userId,
  status: "Closed",
});

    // ========================================
    // AVERAGE RESOLUTION TIME
    // ========================================

    const resolutionTimeData = await Issue.aggregate([
      {
        $match: {
          reportedBy: userId,
          status: "Resolved",
          resolvedAt: { $ne: null },
        },
      },
      {
        $project: {
          resolutionTime: {
            $subtract: ["$resolvedAt", "$createdAt"],
          },
        },
      },
      {
        $group: {
          _id: null,
          averageResolutionTime: {
            $avg: "$resolutionTime",
          },
        },
      },
    ]);

    const averageResolutionTime =
      resolutionTimeData.length > 0
        ? Math.round(
            resolutionTimeData[0].averageResolutionTime /
              (1000 * 60 * 60)
          )
        : 0;

    // ========================================
    // DEFECTS BY STATUS
    // ========================================

    const defectsByStatus = await Issue.aggregate([
      {
        $match: {
          reportedBy: userId,
        },
      },
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // ========================================
    // DEFECTS BY PRIORITY
    // ========================================

    const defectsByPriority = await Issue.aggregate([
      {
        $match: {
          reportedBy: userId,
        },
      },
      {
        $group: {
          _id: "$priority",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // ========================================
    // DEFECTS BY SEVERITY
    // ========================================

    const defectsBySeverity = await Issue.aggregate([
      {
        $match: {
          reportedBy: userId,
        },
      },
      {
        $group: {
          _id: "$severity",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // ========================================
    // DEFECTS BY CATEGORY
    // ========================================

    const defectsByCategory = await Issue.aggregate([
      {
        $match: {
          reportedBy: userId,
        },
      },
      {
        $group: {
          _id: "$category",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // ========================================
    // DEVELOPER WORKLOAD
    // ========================================

    const developerWorkload = await TeamMember.aggregate([
      {
        $match: {
          owner: userId,
        },
      },
      {
        $project: {
          _id: 0,
          name: "$name",
          value: {
            $size: {
              $ifNull: ["$assignedTasks", []],
            },
          },
        },
      },
      {
        $match: {
          value: { $gt: 0 },
        },
      },
    ]);

    // ========================================
    // DEFECT TRENDS
    // ========================================

    const defectTrends = await Issue.aggregate([
      {
        $match: {
          reportedBy: userId,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    // ========================================
    // FORMAT ANALYTICS DATA
    // ========================================

    const formattedDefectsByStatus = defectsByStatus.map((item) => ({
      name: item._id || "Unknown",
      value: item.count,
    }));

    const formattedDefectsByPriority = defectsByPriority.map((item) => ({
      name: item._id || "Unknown",
      value: item.count,
    }));

    const formattedDefectsBySeverity = defectsBySeverity.map((item) => ({
      name: item._id || "Unknown",
      value: item.count,
    }));

    const formattedDefectsByCategory = defectsByCategory.map((item) => ({
      name: item._id || "Unknown",
      value: item.count,
    }));

    const formattedDefectTrends = defectTrends.map((item) => ({
      name: item._id,
      value: item.count,
    }));

    // ========================================
    // SEND NORMAL DASHBOARD RESPONSE
    // NO GEMINI HERE
    // ========================================

    return res.status(200).json({
      success: true,

      summary: {
        totalDefects,
        openDefects,
        inProgressDefects,
        inReviewDefects,
        resolvedDefects,
         closedDefects,
        averageResolutionTime,
      },

      defectsByStatus: formattedDefectsByStatus,
      defectsByPriority: formattedDefectsByPriority,
      defectsBySeverity: formattedDefectsBySeverity,
      defectsByCategory: formattedDefectsByCategory,
      developerWorkload,
      defectTrends: formattedDefectTrends,
    });

  } catch (error) {
    console.error("Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data",
    });
  }
};
// =====================================================
// GET AI ANALYTICS INSIGHTS
// GET /api/analytics/insights
// =====================================================

exports.getAIAnalyticsInsights = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Get basic analytics data
    const totalDefects = await Issue.countDocuments({
      reportedBy: userId,
    });

    const openDefects = await Issue.countDocuments({
      reportedBy: userId,
      status: "Open",
    });

    const inProgressDefects = await Issue.countDocuments({
      reportedBy: userId,
      status: "In Progress",
    });

    const inReviewDefects = await Issue.countDocuments({
      reportedBy: userId,
      status: "In Review",
    });

    const resolvedDefects = await Issue.countDocuments({
      reportedBy: userId,
      status: "Resolved",
    });

    // Generate AI insights
    const aiInsights = await generateAnalyticsInsights({
      summary: {
        totalDefects,
        openDefects,
        inProgressDefects,
        inReviewDefects,
        resolvedDefects,
      },
    });

    return res.status(200).json({
      success: true,
      aiInsights,
    });

  } catch (error) {
    console.error("AI Insights Full Error:", error);
console.error("AI Insights Message:", error.message);

    return res.status(503).json({
      success: false,
      message: "AI insights are temporarily unavailable. Please try again later.",
    });
  }
};