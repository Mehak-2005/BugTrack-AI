const {
  generateBugReport,
  analyzeBug,
  generateResolutionAssistance,
  generateTestCases,
  recommendDeveloper,
  generateResolutionVerification,
} = require("../services/geminiService");

const Issue = require("../models/Issue");
const TeamMember = require("../models/TeamMember");
// ==========================================
// GENERATE AI BUG REPORT
// POST /api/ai/generate-bug-report
// ==========================================

exports.generateAIReport = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      projectName,
    } = req.body;

    // ==========================================
    // VALIDATE DESCRIPTION
    // ==========================================

    if (!description || !description.trim()) {
      return res.status(400).json({
        error: "Bug description is required",
      });
    }

    // ==========================================
    // GENERATE AI BUG REPORT
    // ==========================================

    const report = await generateBugReport({
      title:
        title?.trim() || "Untitled Issue",

      description:
        description.trim(),

      priority:
        priority || "Medium",

      projectName:
        projectName?.trim() ||
        "Not specified",
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      report,
    });

  } catch (error) {
    console.error(
      "AI report generation error:",
      error
    );

    return res.status(500).json({
      error:
        error.message ||
        "Failed to generate AI report",
    });
  }
};


// ==========================================
// AI BUG TRIAGE
// POST /api/ai/triage
// ==========================================

exports.analyzeBug = async (req, res) => {
  try {
    const {
      description,
    } = req.body;

    // ==========================================
    // VALIDATE DESCRIPTION
    // ==========================================

    if (!description || !description.trim()) {
      return res.status(400).json({
        error: "Bug description is required",
      });
    }

    // ==========================================
    // ANALYZE BUG
    // ==========================================

    const analysis = await analyzeBug({
      description:
        description.trim(),
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      message:
        "Bug analyzed successfully",

      analysis,
    });

  } catch (error) {
    console.error(
      "AI triage error:",
      error
    );

    return res.status(500).json({
      error:
        error.message ||
        "Failed to analyze bug",
    });
  }
};


// ==========================================
// AI RESOLUTION ASSISTANCE
// POST /api/ai/analyze-resolution/:issueId
// ==========================================
// This is the NEW feature.
//
// It:
// 1. Finds the issue
// 2. Sends issue information to Gemini
// 3. Gets resolution assistance
// 4. Saves the result in MongoDB
// 5. Returns the analysis
// ==========================================

exports.analyzeResolution = async (req, res) => {
  try {
    const {
      issueId,
    } = req.params;

    // ==========================================
    // VALIDATE ISSUE ID
    // ==========================================

    if (!issueId) {
      return res.status(400).json({
        error: "Issue ID is required",
      });
    }

    // ==========================================
    // FIND ISSUE
    // ==========================================

    const issue =
      await Issue.findOne({
        _id: issueId,
        reportedBy: req.user.id,
      }).populate(
        "project",
        "projectName"
      );

    // ==========================================
    // ISSUE NOT FOUND
    // ==========================================

    if (!issue) {
      return res.status(404).json({
        error:
          "Issue not found or you do not have permission to access it",
      });
    }

    // ==========================================
    // VALIDATE DESCRIPTION
    // ==========================================

    if (
      !issue.description ||
      !issue.description.trim()
    ) {
      return res.status(400).json({
        error:
          "Issue description is required for resolution analysis",
      });
    }

    // ==========================================
    // GENERATE RESOLUTION ASSISTANCE
    // ==========================================

    const resolution =
      await generateResolutionAssistance({
        title:
          issue.title || "Untitled Issue",

        description:
          issue.description,

        category:
          issue.category || "Other",

        severity:
          issue.severity || "Medium",

        priority:
          issue.priority || "Medium",

        report:
          issue.report || "",
      });

    // ==========================================
    // SAVE AI ANALYSIS
    // ==========================================

    issue.aiAnalysis = {
      ...resolution,

      generatedAt:
        new Date(),
    };

    await issue.save();

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      message:
        "AI resolution assistance generated successfully",

      issueId:
        issue._id,

      analysis:
        issue.aiAnalysis,
    });

  } catch (error) {
    console.error(
      "AI resolution assistance error:",
      error
    );

    return res.status(500).json({
      error:
        error.message ||
        "Failed to generate AI resolution assistance",
    });
  }
};

// ==========================================
// AI TEST-CASE GENERATION
// POST /api/ai/generate-tests/:issueId
// ==========================================

exports.generateTests = async (req, res) => {
  try {
    const { issueId } = req.params;

    // ==========================================
    // VALIDATE ISSUE ID
    // ==========================================

    if (!issueId) {
      return res.status(400).json({
        error: "Issue ID is required",
      });
    }

    // ==========================================
    // FIND ISSUE
    // ==========================================

    const issue = await Issue.findOne({
      _id: issueId,
      reportedBy: req.user.id,
    });

    // ==========================================
    // ISSUE NOT FOUND
    // ==========================================

    if (!issue) {
      return res.status(404).json({
        error:
          "Issue not found or you do not have permission to access it",
      });
    }

    // ==========================================
    // VALIDATE DESCRIPTION
    // ==========================================

    if (
      !issue.description ||
      !issue.description.trim()
    ) {
      return res.status(400).json({
        error:
          "Issue description is required for test generation",
      });
    }

    // ==========================================
    // GET AI RESOLUTION INFORMATION
    // ==========================================

    const probableRootCause =
      issue.aiAnalysis?.probableRootCause || "";

    const recommendedFix =
      issue.aiAnalysis?.recommendedFix || "";

    // ==========================================
    // GENERATE TEST CASES
    // ==========================================

    const testCases = await generateTestCases({
      title:
        issue.title || "Untitled Issue",

      description:
        issue.description,

      category:
        issue.category || "Other",

      severity:
        issue.severity || "Medium",

      priority:
        issue.priority || "Medium",

      probableRootCause,

      recommendedFix,
    });

    // ==========================================
    // SAVE TEST CASES
    // ==========================================

    issue.generatedTestCases = testCases.map(
      (testCase) => ({
        ...testCase,
        generatedAt: new Date(),
      })
    );

    await issue.save();

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      message:
        "AI test cases generated successfully",

      issueId:
        issue._id,

      testCases:
        issue.generatedTestCases,
    });

  } catch (error) {

    console.error(
      "AI test case generation error:",
      error
    );

    return res.status(500).json({
      error:
        error.message ||
        "Failed to generate AI test cases",
    });
  }
};

// ==========================================
// AI RESOLUTION VERIFICATION
// POST /api/ai/verify-resolution/:issueId
// ==========================================

exports.verifyResolution = async (req, res) => {
  try {
    const { issueId } = req.params;

    const { developerFix } = req.body;

    // ==========================================
    // VALIDATE ISSUE ID
    // ==========================================

    if (!issueId) {
      return res.status(400).json({
        error: "Issue ID is required",
      });
    }

    // ==========================================
    // VALIDATE DEVELOPER FIX
    // ==========================================

    if (!developerFix || !developerFix.trim()) {
      return res.status(400).json({
        error: "Developer fix description is required",
      });
    }

    // ==========================================
    // FIND ISSUE
    // ==========================================

    const issue = await Issue.findOne({
      _id: issueId,
      reportedBy: req.user.id,
    });

    // ==========================================
    // ISSUE NOT FOUND
    // ==========================================

    if (!issue) {
      return res.status(404).json({
        error:
          "Issue not found or you do not have permission to access it",
      });
    }

    // ==========================================
    // VALIDATE ISSUE DESCRIPTION
    // ==========================================

    if (
      !issue.description ||
      !issue.description.trim()
    ) {
      return res.status(400).json({
        error:
          "Issue description is required for resolution verification",
      });
    }

    // ==========================================
    // GET EXISTING AI RESOLUTION INFORMATION
    // ==========================================

    const probableRootCause =
      issue.aiAnalysis?.probableRootCause || "";

    const recommendedFix =
      issue.aiAnalysis?.recommendedFix || "";

    // ==========================================
    // GENERATE VERIFICATION
    // ==========================================

    const verification =
      await generateResolutionVerification({
        title:
          issue.title || "Untitled Issue",

        description:
          issue.description,

        category:
          issue.category || "Other",

        severity:
          issue.severity || "Medium",

        priority:
          issue.priority || "Medium",

        probableRootCause,

        recommendedFix,

        developerFix:
          developerFix.trim(),
      });

      // ==========================================
// SAVE VERIFICATION RESULT
// ==========================================

issue.resolutionVerification = {
  ...verification,

  developerFix:
    developerFix.trim(),

  generatedAt:
    new Date(),
};

await issue.save();
    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      message:
        "AI resolution verification completed successfully",

      issueId:
        issue._id,

      verification,
    });

  } catch (error) {

    console.error(
      "AI resolution verification error:",
      error
    );

    return res.status(500).json({
      error:
        error.message ||
        "Failed to verify AI resolution",
    });
  }
};
/// ==========================================
// AI DEVELOPER RECOMMENDATION
// POST /api/ai/recommend-developer/:issueId
// ==========================================

exports.recommendDeveloper = async (req, res) => {
  try {
    const { issueId } = req.params;

    // ==========================================
    // VALIDATE ISSUE ID
    // ==========================================

    if (!issueId) {
      return res.status(400).json({
        error: "Issue ID is required",
      });
    }

    // ==========================================
    // FIND ISSUE
    // ==========================================

    const issue = await Issue.findOne({
      _id: issueId,
      reportedBy: req.user.id,
    });

    // ==========================================
    // ISSUE NOT FOUND
    // ==========================================

    if (!issue) {
      return res.status(404).json({
        error:
          "Issue not found or you do not have permission to access it",
      });
    }

    // ==========================================
    // VALIDATE DESCRIPTION
    // ==========================================

    if (
      !issue.description ||
      !issue.description.trim()
    ) {
      return res.status(400).json({
        error:
          "Issue description is required for developer recommendation",
      });
    }

    // ==========================================
    // GET TEAM MEMBERS
    // ONLY MEMBERS BELONGING TO CURRENT USER
    // ==========================================

    const developers = await TeamMember.find({
      owner: req.user.id,
    }).select(
      "name skills experience workload role"
    );

    // ==========================================
    // CHECK TEAM MEMBERS
    // ==========================================

    if (
      !developers ||
      developers.length === 0
    ) {
      return res.status(404).json({
        error:
          "No team members are available for recommendation",
      });
    }

    // ==========================================
    // GET AFFECTED MODULE
    // ==========================================

    const affectedModule =
      issue.affectedModule ||
      issue.aiAnalysis?.affectedModule ||
      "";

    // ==========================================
    // GENERATE AI DEVELOPER RECOMMENDATION
    // ==========================================

    const recommendation =
      await recommendDeveloper({
        title:
          issue.title || "Untitled Issue",

        description:
          issue.description,

        category:
          issue.category || "Other",

        severity:
          issue.severity || "Medium",

        priority:
          issue.priority || "Medium",

        affectedModule,

        developers,
      });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      message:
        "Developer recommended successfully",

      issueId:
        issue._id,

      recommendation,
    });

  } catch (error) {

    console.error(
      "AI developer recommendation error:",
      error
    );

    return res.status(500).json({
      error:
        error.message ||
        "Failed to recommend developer",
    });
  }
};