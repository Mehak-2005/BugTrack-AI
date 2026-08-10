const {
  generateBugReport,
  analyzeBug,
} = require("../services/geminiService");

// ==========================================
// GENERATE AI BUG REPORT
// POST /api/ai/report
// ==========================================

exports.generateAIReport = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      projectName,
    } = req.body;

    // Validate description
    if (!description || !description.trim()) {
      return res.status(400).json({
        error: "Bug description is required",
      });
    }

    // Generate complete AI bug report
    const report = await generateBugReport({
      title: title?.trim() || "Untitled Issue",
      description: description.trim(),
      priority: priority || "Medium",
      projectName:
        projectName?.trim() || "Not specified",
    });

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
    const { description } = req.body;

    // Validate description
    if (!description || !description.trim()) {
      return res.status(400).json({
        error: "Bug description is required",
      });
    }

    // Analyze bug using Gemini
    const analysis = await analyzeBug({
      description: description.trim(),
    });

    return res.status(200).json({
      message: "Bug analyzed successfully",
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