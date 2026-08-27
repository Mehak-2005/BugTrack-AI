const Issue = require("../models/Issue");
const Activity = require("../models/Activity");
const mongoose = require("mongoose");
const {
  generateEmbedding,
  cosineSimilarity,
} = require("../services/embeddingService");

// =====================================================
// ALLOWED VALUES
// =====================================================

const VALID_STATUSES = [
  "Open",
  "In Progress",
  "In Review",
  "Resolved",
  "Closed",
];

const VALID_PRIORITIES = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

const VALID_SEVERITIES = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

const VALID_CATEGORIES = [
  "UI",
  "Authentication",
  "Backend",
  "Database",
  "API",
  "Performance",
  "Security",
  "Navigation",
  "Checkout",
  "Other",
];

// =====================================================
// VALID DEFECT TYPES
// =====================================================

const VALID_DEFECT_TYPES = [
  "Functional",
  "UI",
  "Performance",
  "Security",
  "Integration",
  "Data",
  "Other",
];

// =====================================================
// DUPLICATE DETECTION CONFIGURATION
// =====================================================

// Similarity from 0 to 1.
// 0.85 means 85% semantic similarity.
const DUPLICATE_THRESHOLD = 0.85;
   
// =====================================================
// FIND SIMILAR ISSUES
// =====================================================

const findSimilarIssues = async ({
  description,
  project,
  excludeIssueId = null,
}) => {
  try {
    // Generate embedding for the new description
    const newEmbedding =
      await generateEmbedding(description);

    // ---------------------------------------------
    // Find existing issues that have embeddings
    // ---------------------------------------------

    const query = {
      embedding: {
        $exists: true,
        $ne: [],
      },
    };

    // If project is provided, search within
    // the same project.
    if (project) {
      query.project = project;
    }

    // Don't compare an issue with itself
    if (excludeIssueId) {
      query._id = {
        $ne: excludeIssueId,
      };
    }

    const existingIssues =
      await Issue.find(query)
        .select(
          "_id title description status priority severity category defectType affectedModule project embedding"
        )
        .limit(100);

    const similarIssues = [];

    // ---------------------------------------------
    // Calculate cosine similarity
    // ---------------------------------------------

    for (const existingIssue of existingIssues) {
      if (
        !Array.isArray(existingIssue.embedding) ||
        existingIssue.embedding.length === 0
      ) {
        continue;
      }

      const similarity = cosineSimilarity(
        newEmbedding,
        existingIssue.embedding
      );

      if (similarity >= DUPLICATE_THRESHOLD) {
        similarIssues.push({
          issueId: existingIssue._id,
          title:
            existingIssue.title ||
            "Untitled Issue",
          description:
            existingIssue.description,
          status: existingIssue.status,
          priority: existingIssue.priority,
          severity: existingIssue.severity,
          category: existingIssue.category,
          similarity:
            Math.round(similarity * 100) / 100,
          similarityPercentage:
            Math.round(similarity * 100),
            defectType:
  existingIssue.defectType,

affectedModule:
  existingIssue.affectedModule,
        });
      }
    }

    // Highest similarity first
    similarIssues.sort(
      (a, b) =>
        b.similarity - a.similarity
    );

    return {
      embedding: newEmbedding,
      similarIssues,
    };
  } catch (error) {
    console.error(
      "Duplicate detection error:",
      error
    );

    throw error;
  }
};

// =====================================================
// CREATE ISSUE
// POST /api/issues
// =====================================================

exports.createIssue = async (req, res) => {
  try {
    const {
      title,
      description,
      report,
      status,
      priority,
      project,
      severity,
      category,
      sprint,
       defectType,
  affectedModule,
   assignedDeveloper,
       skipDuplicateCheck = false,
    } = req.body;

    // =================================================
    // VALIDATE DESCRIPTION
    // =================================================

    if (
      !description ||
      !description.trim()
    ) {
      return res.status(400).json({
        message: "Description is required",
      });
    }

    // =================================================
    // VALIDATE STATUS
    // =================================================

    if (
      status &&
      !VALID_STATUSES.includes(status)
    ) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    // =================================================
    // VALIDATE PRIORITY
    // =================================================

    if (
      priority &&
      !VALID_PRIORITIES.includes(priority)
    ) {
      return res.status(400).json({
        message: "Invalid priority",
      });
    }

    // =================================================
    // VALIDATE SEVERITY
    // =================================================

    if (
      severity &&
      !VALID_SEVERITIES.includes(severity)
    ) {
      return res.status(400).json({
        message: "Invalid severity",
      });
    }

    // =================================================
    // VALIDATE CATEGORY
    // =================================================

    if (
      category &&
      !VALID_CATEGORIES.includes(category)
    ) {
      return res.status(400).json({
        message: "Invalid category",
      });
    }

    // =================================================
// VALIDATE DEFECT TYPE
// =================================================

if (
  defectType &&
  !VALID_DEFECT_TYPES.includes(defectType)
) {
  return res.status(400).json({
    message: "Invalid defect type",
  });
}

    // =================================================
    // GENERATE EMBEDDING + CHECK DUPLICATES
    // =================================================

    const {
      embedding,
      similarIssues,
    } = await findSimilarIssues({
      description:
        description.trim(),
      project,
    });

    // =================================================
    // DUPLICATE FOUND
    // =================================================

    if (!skipDuplicateCheck &&
  similarIssues.length > 0 ) {
      return res.status(409).json({
        message:
          "A similar issue already exists",
        duplicate: true,
        similarIssues,
      });
    }

    // =================================================
    // CREATE ISSUE
    // =================================================
    const issue = await Issue.create({
  title: title?.trim(),

  description:
    description.trim(),

  report,

  status:
    status || "Open",

  priority:
    priority || "Medium",

  severity:
    severity || "Medium",

  category:
    category || "Other",

  defectType:
    defectType || "Other",

  affectedModule:
    affectedModule?.trim() ||
    "Not specified",

  project:
    project || undefined,

  sprint:
    sprint || undefined,

  reportedBy:
    req.user.id,

  assignedDeveloper: assignedDeveloper || null,

  // Store semantic embedding
  embedding,
});

    // =================================================
    // RECORD ISSUE CREATED
    // =================================================

    await Activity.create({
      issue: issue._id,
      user: req.user.id,
      action: "Issue created",
      details: `Created issue "${
        issue.title ||
        "Untitled Issue"
      }"`,
    });

    res.status(201).json(issue);

  } catch (error) {
    console.error(
      "Create issue error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create issue",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL ISSUES OF LOGGED-IN USER
// GET /api/issues
// =====================================================

exports.getIssues = async (
  req,
  res
) => {
  try {
    const issues =
      await Issue.find({
        reportedBy: req.user.id,
      })
        .populate(
          "reportedBy",
          "name email"
        )
        .populate(
          "project",
          "projectName"
        )
        .populate(
          "sprint",
          "name"
        )
         .populate(
      "assignedDeveloper",
      "name role skills experience workload email"
         )
        .sort({
          createdAt: -1,
        });

    res.status(200).json(issues);

  } catch (error) {
    console.error(
      "Get issues error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch issues",
      error: error.message,
    });
  }
};

// =====================================================
// SAVE AI-GENERATED ISSUE
// POST /api/issues/save
// =====================================================

exports.saveIssue = async (
  req,
  res
) => {
  try {
    const {
      title,
      description,
      report,
      priority,
      severity,
      category,
      project,
      affectedModule,
       defectType,
       assignedDeveloper,
      skipDuplicateCheck = false
    } = req.body;

    // =================================================
    // VALIDATE DESCRIPTION
    // =================================================

    if (
      !description ||
      !description.trim()
    ) {
      return res.status(400).json({
        message:
          "Description is required",
      });
    }

    // =================================================
    // VALIDATE PRIORITY
    // =================================================

    if (
      priority &&
      !VALID_PRIORITIES.includes(
        priority
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid priority",
      });
    }

    // =================================================
    // VALIDATE SEVERITY
    // =================================================

    if (
      severity &&
      !VALID_SEVERITIES.includes(
        severity
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid severity",
      });
    }

    // =================================================
    // VALIDATE CATEGORY
    // =================================================

    if (
      category &&
      !VALID_CATEGORIES.includes(
        category
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid category",
      });
    }

    // =================================================
// VALIDATE DEFECT TYPE
// =================================================

if (
  defectType &&
  !VALID_DEFECT_TYPES.includes(defectType)
) {
  return res.status(400).json({
    message: "Invalid defect type",
  });
}
    // =================================================
    // GENERATE EMBEDDING + CHECK DUPLICATES
    // =================================================

    const {
      embedding,
      similarIssues,
    } = await findSimilarIssues({
      description:
        description.trim(),
      project,
    });

    // =================================================
    // DUPLICATE FOUND
    // =================================================

    if ( !skipDuplicateCheck &&
  similarIssues.length > 0) {
      return res.status(409).json({
        message:
          "A similar issue already exists",
        duplicate: true,
        similarIssues,
      });
    }

    // =================================================
    // CREATE SAVED AI ISSUE
    // =================================================
    const issue =
  await Issue.create({
    title: title?.trim(),

    description:
      description.trim(),

    report,

    status: "Open",

    priority:priority || "Medium",

    severity:severity || "Medium",

    category: category || "Other",

    defectType:
      defectType || "Other",

    affectedModule:
      affectedModule?.trim() ||
      "Not specified",

    project:
      project || undefined,

    reportedBy:
      req.user.id,

  assignedDeveloper:assignedDeveloper || null,

    embedding,
  });
    // =================================================
    // RECORD AI ISSUE CREATED
    // =================================================
    await Activity.create({
      issue: issue._id,

      issueTitle:
        issue.title ||
        issue.description ||
        "Untitled Issue",

      user: req.user.id,

      action:
        "Issue created",

      details: `Saved AI-generated issue "${
        issue.title ||
        issue.description ||
        "Untitled Issue"
      }"`,
    });

    res.status(201).json(issue);

  } catch (error) {
    console.error(
      "Save issue error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create issue",
      error: error.message,
    });
  }
};

// =====================================================
// GET SAVED ISSUES
// GET /api/issues/saved
// =====================================================

exports.getSavedIssues = async (
  req,
  res
) => {
  try {
    const issues =
      await Issue.find({
        reportedBy: req.user.id,
      })
        .populate(
          "reportedBy",
          "name email"
        )
        .populate(
          "project",
          "projectName"
        )
        .populate(
          "sprint",
          "name"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json(issues);

  } catch (error) {
    console.error(
      "Get saved issues error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch saved issues",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE ISSUE
// PUT /api/issues/:id
// =====================================================

exports.updateIssue = async (req,res) => {
  try {
    // Validate issue ID
    const {
      title,
      description,
      status,
      priority,
      severity,
      category,
      project,
      sprint,
      defectType,
  affectedModule,
  assignedDeveloper,
  skipDuplicateCheck = false,
    } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
  return res.status(400).json({
    message: "Invalid issue ID",
  });
}

      // Validate related IDs if provided
    if (project && !mongoose.isValidObjectId(project)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    if (sprint && !mongoose.isValidObjectId(sprint)) {
      return res.status(400).json({
        message: "Invalid sprint ID",
      });
    }

    if (
      assignedDeveloper &&
      !mongoose.isValidObjectId(assignedDeveloper)
    ) {
      return res.status(400).json({
        message: "Invalid assigned developer ID",
      });
    }

    // Validate project exists and belongs to logged-in user
if (project) {
  const existingProject = await Project.findOne({
    _id: project,
    owner: req.user.id,
  });

  if (!existingProject) {
    return res.status(404).json({
      message: "Project not found",
    });
  }
}

// Validate sprint exists
if (sprint) {
  const existingSprint = await Sprint.findById(sprint);

  if (!existingSprint) {
    return res.status(404).json({
      message: "Sprint not found",
    });
  }
}

// Validate assigned developer exists and belongs to logged-in user
if (assignedDeveloper) {
  const existingDeveloper = await TeamMember.findOne({
    _id: assignedDeveloper,
    owner: req.user.id,
  });

  if (!existingDeveloper) {
    return res.status(404).json({
      message: "Assigned developer not found",
    });
  }
}

    // =================================================
    // VALIDATION
    // =================================================

    if (
      status &&
      !VALID_STATUSES.includes(
        status
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid status",
      });
    }

    if (
      priority &&
      !VALID_PRIORITIES.includes(
        priority
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid priority",
      });
    }

    if (
      severity &&
      !VALID_SEVERITIES.includes(
        severity
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid severity",
      });
    }

    if (
      category &&
      !VALID_CATEGORIES.includes(
        category
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid category",
      });
    }

    // =================================================
    // FIND EXISTING ISSUE
    // =================================================

    const existingIssue =
      await Issue.findOne({
        _id: req.params.id,
        reportedBy: req.user.id,
      });

    if (!existingIssue) {
      return res.status(404).json({
        message:
          "Issue not found or you do not have permission to update it",
      });
    }

    // =================================================
    // STATUS WORKFLOW VALIDATION
    // =================================================

    if (status !== undefined) {
      const allowedTransitions = {
        Open: [
          "Open",
          "In Progress",
        ],

        "In Progress": [
          "In Progress",
          "In Review",
        ],

        "In Review": [
          "In Review",
          "Resolved",
        ],

        Resolved: [
          "Resolved",
          "Closed",
        ],
      };

      const currentStatus =
        existingIssue.status;

      if (
        !allowedTransitions[
          currentStatus
        ]?.includes(status)
      ) {
        return res.status(400).json({
          message: `Invalid status transition: ${currentStatus} → ${status}`,
        });
      }
    }

    if (
  defectType &&
  !VALID_DEFECT_TYPES.includes(defectType)
) {
  return res.status(400).json({
    message: "Invalid defect type",
  });
}

    // =================================================
    // BUILD UPDATE DATA
    // =================================================

    const updateData = {};

    if (title !== undefined) {
      updateData.title =
        title.trim();
    }

    if (
      description !== undefined
    ) {
      updateData.description =
        description.trim();
    }

    if (status !== undefined) {
  updateData.status = status;

  if (status === "Resolved" && 
    existingIssue.status !== "Resolved") {
    updateData.resolvedAt = new Date();
  }
}

// ========================================
// ASSIGNED DEVELOPER
// ========================================
if (assignedDeveloper !== undefined) {
    updateData.assignedDeveloper =
        assignedDeveloper || null;
}

    if (priority !== undefined) {
      updateData.priority =
        priority;
    }

    if (severity !== undefined) {
      updateData.severity =
        severity;
    }

    if (category !== undefined) {
      updateData.category =
        category;
    }

    if (project !== undefined) {
      updateData.project =
        project || null;
    }

    if (sprint !== undefined) {
      updateData.sprint =
        sprint;
    }
    if (defectType !== undefined) {
  updateData.defectType =
    defectType;
}

if (affectedModule !== undefined) {
  updateData.affectedModule =
    affectedModule.trim();
}

    // =================================================
    // REGENERATE EMBEDDING IF DESCRIPTION CHANGED
    // =================================================

    if (
      description !== undefined &&
      description.trim() !==
        existingIssue.description
    ) {
      const newEmbedding =
        await generateEmbedding(
          description.trim()
        );

      updateData.embedding =
        newEmbedding;
    }

    // =================================================
    // UPDATE ISSUE
    // =================================================

    const issue =
      await Issue.findOneAndUpdate(
        {
          _id: req.params.id,
          reportedBy:
            req.user.id,
        },

        {
          $set: updateData,
        },

        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "reportedBy",
          "name email"
        )
        .populate(
          "project",
          "projectName"
        )
        .populate(
          "sprint",
          "name"
        )
        .populate(
      "assignedDeveloper",
      "name role skills experience workload email"
    )
    .sort({
      createdAt: -1,
    }
);

    if (!issue) {
      return res.status(404).json({
        message:
          "Issue not found or you do not have permission to update it",
      });
    }

    // =================================================
    // ACTIVITY HISTORY
    // =================================================

    const activities = [];

    // STATUS CHANGED
    if (
      status !== undefined &&
      status !== existingIssue.status
    ) {
      activities.push({
        issue: issue._id,
        user: req.user.id,
        action:
          "Status changed",
        details:
          `${existingIssue.status} → ${status}`,
      });
    }

    // PRIORITY CHANGED
    if (
      priority !== undefined &&
      priority !==
        existingIssue.priority
    ) {
      activities.push({
        issue: issue._id,
        user: req.user.id,
        action:
          "Priority changed",
        details:
          `${existingIssue.priority} → ${priority}`,
      });
    }

    // SEVERITY CHANGED
    if (
      severity !== undefined &&
      severity !==
        existingIssue.severity
    ) {
      activities.push({
        issue: issue._id,
        user: req.user.id,
        action:
          "Severity changed",
        details:
          `${existingIssue.severity} → ${severity}`,
      });
    }

    // CATEGORY CHANGED
    if (
      category !== undefined &&
      category !==
        existingIssue.category
    ) {
      activities.push({
        issue: issue._id,
        user: req.user.id,
        action:
          "Category changed",
        details:
          `${existingIssue.category} → ${category}`,
      });
    }

    // TITLE CHANGED
    if (
      title !== undefined &&
      title.trim() !==
        existingIssue.title
    ) {
      activities.push({
        issue: issue._id,
        user: req.user.id,
        action:
          "Title changed",
        details: `"${existingIssue.title || "Untitled Issue"}" → "${title.trim()}"`,
      });
    }

    // DESCRIPTION CHANGED
    if (
      description !== undefined &&
      description.trim() !==
        existingIssue.description
    ) {
      activities.push({
        issue: issue._id,
        user: req.user.id,
        action:
          "Description updated",
        details:
          "Issue description was updated",
      });
    }

    // PROJECT CHANGED
    if (project !== undefined) {
      const oldProject =
        existingIssue.project?.toString() ||
        null;

      const newProject =
        project || null;

      if (
        oldProject !==
        newProject
      ) {
        activities.push({
          issue: issue._id,
          user: req.user.id,
          action:
            "Project changed",
          details:
            "Issue project was changed",
        });
      }
    }

    // SPRINT CHANGED
    if (sprint !== undefined) {
      const oldSprint =
        existingIssue.sprint?.toString() ||
        null;

      const newSprint =
        sprint || null;

      if (
        oldSprint !==
        newSprint
      ) {
        activities.push({
          issue: issue._id,
          user: req.user.id,
          action:
            "Sprint changed",
          details:
            "Issue sprint was changed",
        });
      }
    }

    // =================================================
    // SAVE ACTIVITIES
    // =================================================

    if (
      activities.length > 0
    ) {
      await Activity.insertMany(
        activities
      );
    }

    res.status(200).json({
      message:
        "Issue updated successfully",
      issue,
    });

  } catch (error) {
    console.error(
      "Update issue error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update issue",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE ISSUE
// DELETE /api/issues/:id
// =====================================================

exports.deleteIssue = async (req,res) => {
  try {
    // Validate issue ID
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid issue ID",
      });
    }
    // =================================================
    // FIND ISSUE
    // =================================================

    const issue =await Issue.findOne({
        _id: req.params.id,
        reportedBy: req.user.id,
      });

    if (!issue) {
      return res.status(404).json({
        message:
          "Issue not found or you do not have permission to delete it",
      });
    }

    // =================================================
    // SAVE TITLE BEFORE DELETE
    // =================================================

    const issueTitle =
      issue.title ||
      issue.description ||
      "Untitled Issue";

    // =================================================
    // CREATE DELETION ACTIVITY
    // =================================================

    await Activity.create({
      issue: issue._id,
      issueTitle: issueTitle,
      user: req.user.id,
      action:
        "Issue deleted",
      details:
        `Deleted issue "${issueTitle}"`,
    });

    // =================================================
    // DELETE ISSUE
    // =================================================

    await Issue.deleteOne({
      _id: issue._id,
    });

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      message:
        "Issue deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete issue error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete issue",
      error: error.message,
    });
  }
};

// =========================================
// SEMANTIC SEARCH
// =========================================
exports.semanticSearch = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || !query.trim()) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    // Generate embedding for user's search query
    const queryEmbedding = await generateEmbedding(query.trim());

    // Get issues belonging to the logged-in user
    const issues = await Issue.find({
      reportedBy: req.user.id,
      embedding: { $exists: true, $ne: [] },
    }).lean();

    // Calculate semantic similarity
    const results = issues
      .map((issue) => ({
        ...issue,
        similarity: cosineSimilarity(
          queryEmbedding,
          issue.embedding
        ),
      }))
      .filter((issue) => issue.similarity >= 0.45)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10);

    return res.status(200).json({
      query,
      results,
    });

  } catch (error) {
    console.error("Semantic Search Error:", error);

    return res.status(500).json({
      message: "Semantic search failed",
      error: error.message,
    });
  }
};
// =====================================================
// GET ANALYTICS
// GET /api/issues/analytics
// =====================================================

exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const issues = await Issue.find({
      reportedBy: userId,
    });

    const totalDefects = issues.length;

    const openDefects = issues.filter(
      (issue) => issue.status === "Open"
    ).length;

    const inProgressDefects = issues.filter(
      (issue) => issue.status === "In Progress"
    ).length;

    const resolvedDefects = issues.filter(
      (issue) => issue.status === "Resolved"
    ).length;

    const closedDefects = issues.filter(
      (issue) => issue.status === "Closed"
    ).length;

    const defectsBySeverity = {};
    const defectsByCategory = {};
    const defectsByStatus = {};

    issues.forEach((issue) => {
      // Severity
      if (issue.severity) {
        defectsBySeverity[issue.severity] =
          (defectsBySeverity[issue.severity] || 0) + 1;
      }

      // Category
      if (issue.category) {
        defectsByCategory[issue.category] =
          (defectsByCategory[issue.category] || 0) + 1;
      }

      // Status
      if (issue.status) {
        defectsByStatus[issue.status] =
          (defectsByStatus[issue.status] || 0) + 1;
      }
    });

    res.status(200).json({
      totalDefects,
      openDefects,
      inProgressDefects,
      resolvedDefects,
      closedDefects,
      defectsBySeverity,
      defectsByCategory,
      defectsByStatus,
    });

  } catch (error) {
    console.error("Analytics Error:", error);

    res.status(500).json({
      message: "Failed to fetch analytics",
      error: error.message,
    });
  }
};
exports.getDeveloperWorkload = async (req, res) => {
  try {
    const workload = await Issue.aggregate([
      {
        $match: {
          assignedDeveloper: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$assignedDeveloper",

          totalDefects: {
            $sum: 1,
          },

          openDefects: {
            $sum: {
              $cond: [
                { $eq: ["$status", "Open"] },
                1,
                0,
              ],
            },
          },

          inProgressDefects: {
            $sum: {
              $cond: [
                { $eq: ["$status", "In Progress"] },
                1,
                0,
              ],
            },
          },

          resolvedDefects: {
            $sum: {
              $cond: [
                { $eq: ["$status", "Resolved"] },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $lookup: {
          from: "teammembers",
          localField: "_id",
          foreignField: "_id",
          as: "developer",
        },
      },

      {
        $unwind: "$developer",
      },

      {
        $project: {
          _id: 1,
          name: "$developer.name",
          totalDefects: 1,
          openDefects: 1,
          inProgressDefects: 1,
          resolvedDefects: 1,
        },
      },
    ]);

    res.status(200).json({
      workload,
    });

  } catch (error) {
    console.error("Developer workload error:", error);

    res.status(500).json({
      message: "Failed to fetch developer workload",
    });
  }
};
// =====================================================
// GET DEFECT TRENDS
// GET /api/issues/analytics/trends
// =====================================================

exports.getDefectTrends = async (req, res) => {
  try {
    const userId = req.user.id;

    const trends = await Issue.aggregate([
      {
        $match: {
          reportedBy: new mongoose.Types.ObjectId(userId),
        },
      },

      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
          },

          created: {
            $sum: 1,
          },

          resolved: {
            $sum: {
              $cond: [
                { $eq: ["$status", "Resolved"] },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          date: "$_id.date",
          created: 1,
          resolved: 1,
        },
      },

      {
        $sort: {
          date: 1,
        },
      },
    ]);

    res.status(200).json({
      trends,
    });

  } catch (error) {
    console.error("Defect trends error:", error);

    res.status(500).json({
      message: "Failed to fetch defect trends",
      error: error.message,
    });
  }
};
// =====================================================
// GET AVERAGE RESOLUTION TIME
// GET /api/issues/analytics/resolution-time
// =====================================================

exports.getAverageResolutionTime = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Issue.aggregate([
      {
        $match: {
          reportedBy: new mongoose.Types.ObjectId(userId),
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
          resolvedDefects: {
            $sum: 1,
          },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        averageResolutionTimeHours: 0,
        resolvedDefects: 0,
      });
    }

    const averageMilliseconds =
      result[0].averageResolutionTime;

    const averageResolutionTimeHours =
      Number(
        (averageMilliseconds / (1000 * 60 * 60)).toFixed(2)
      );

    res.status(200).json({
      averageResolutionTimeHours,
      resolvedDefects: result[0].resolvedDefects,
    });

  } catch (error) {
    console.error(
      "Average resolution time error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to calculate average resolution time",
      error: error.message,
    });
  }
};