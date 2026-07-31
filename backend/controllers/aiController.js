const {
  generateBugReport,
} = require("../services/geminiService");

// GENERATE AI BUG REPORT
exports.generateAIReport = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      projectName,
    } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({
        error: "Bug description is required",
      });
    }

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