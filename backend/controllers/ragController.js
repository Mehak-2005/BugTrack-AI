const Issue = require("../models/Issue");
const { retrieveRelevantIssues, buildRagContext } = require("../services/ragService");

const searchSimilarIssues = async (req, res) => {
  try {
    const {
      title,
      description,
      defectType,
      affectedModule,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const allIssues = await Issue.find();

    if (!allIssues || allIssues.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No historical issues found for RAG retrieval",
      });
    }

    const queryText = `
Title: ${title}
Description: ${description}
Defect Type: ${defectType || "Not specified"}
Affected Module: ${affectedModule || "Not specified"}
`;

    const relevantIssues = await retrieveRelevantIssues(
      queryText,
      allIssues
    );

    const ragContext = buildRagContext(relevantIssues);

    return res.status(200).json({
      success: true,
      message: "Relevant issues retrieved successfully",
      relevantIssues,
      ragContext,
    });
  } catch (error) {
    console.error("RAG Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve relevant issues",
    });
  }
};

module.exports = {
  searchSimilarIssues,
};