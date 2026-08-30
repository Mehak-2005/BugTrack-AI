const Issue = require("../models/Issue");
const {
  generateEmbedding,
  cosineSimilarity,
} = require("./embeddingService");

// ========================================
// RETRIEVE RELEVANT ISSUES FOR RAG
// ========================================

const retrieveRelevantIssues = async (
  query,
  userId,
  currentIssueId = null,
  limit = 5
) => {
  try {
    if (!query || !query.trim()) {
      throw new Error("Query is required for RAG retrieval");
    }

    // Generate embedding for the user's question/current issue
    const queryEmbedding = await generateEmbedding(
      query.trim()
    );

    // Get issues belonging to the logged-in user
    // that already have embeddings
    const mongoQuery = {
  reportedBy: userId,
  embedding: { $exists: true, $ne: [] },
};

// Prevent the current issue from retrieving itself
if (currentIssueId) {
  mongoQuery._id = { $ne: currentIssueId };
}

const issues = await Issue.find(mongoQuery).lean();

    // Calculate similarity
    const relevantIssues = issues
      .map((issue) => ({
        ...issue,
        similarity: cosineSimilarity(
          queryEmbedding,
          issue.embedding
        ),
      }))
      .filter((issue) => issue.similarity >= 0.45)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return relevantIssues;
  } catch (error) {
    console.error(
      "RAG Retrieval Error:",
      error
    );

    throw new Error(
      error.message ||
        "Failed to retrieve relevant issues"
    );
  }
};

// ========================================
// BUILD RAG CONTEXT
// ========================================

const buildRagContext = (issues) => {
  if (!issues || issues.length === 0) {
    return "No relevant historical issues were found.";
  }

  return issues
    .map((issue, index) => {
      return `
RELEVANT HISTORICAL ISSUE ${index + 1}

Title:
${issue.title || "Not available"}

Description:
${issue.description || "Not available"}

Status:
${issue.status || "Not available"}

Priority:
${issue.priority || "Not available"}

Category:
${issue.category || "Not available"}

Defect Type:
${issue.defectType || "Not available"}

Affected Module:
${issue.affectedModule || "Not available"}

AI Root Cause:
${issue.aiAnalysis?.probableRootCause || "Not available"}

AI Recommended Fix:
${issue.aiAnalysis?.recommendedFix || "Not available"}

AI Reasoning:
${issue.aiAnalysis?.reasoningSummary || "Not available"}

Similarity Score:
${issue.similarity.toFixed(3)}
`;
    })
    .join("\n\n--------------------------------\n\n");
};
// ========================================
// HISTORICAL RESOLUTION RETRIEVAL FOR RAG
// ========================================

const retrieveHistoricalResolutions = async (
  query,
  userId,
  currentIssueId = null,
  limit = 5
) => {
  try {
    if (!query || !query.trim()) {
      throw new Error(
        "Query is required for historical resolution retrieval"
      );
    }

    if (!userId) {
      throw new Error(
        "User ID is required for historical resolution retrieval"
      );
    }

    // Generate embedding for the current issue
    const queryEmbedding = await generateEmbedding(
      query.trim()
    );

    // Find resolved or closed historical issues
    const mongoQuery = {
      reportedBy: userId,

      status: {
        $in: ["Resolved", "Closed"],
      },

      embedding: {
        $exists: true,
        $ne: [],
      },
    };

    // Prevent current issue from matching itself
    if (currentIssueId) {
      mongoQuery._id = {
        $ne: currentIssueId,
      };
    }

    const issues = await Issue.find(
      mongoQuery
    ).lean();

    // Calculate semantic similarity
    const historicalResolutions = issues
      .map((issue) => ({
        ...issue,

        similarity: cosineSimilarity(
          queryEmbedding,
          issue.embedding
        ),
      }))
      .filter(
        (issue) => issue.similarity >= 0.45
      )
      .sort(
        (a, b) => b.similarity - a.similarity
      )
      .slice(0, limit)
      .map((issue) => ({

        issueId: issue._id,

        title:
          issue.title ||
          "Not available",

        description:
          issue.description ||
          "Not available",

        status:
          issue.status ||
          "Not available",

        category:
          issue.category ||
          "Not available",

        severity:
          issue.severity ||
          "Not available",

        priority:
          issue.priority ||
          "Not available",

        affectedModule:
          issue.affectedModule ||
          "Not available",

        // Historical root cause
        previousRootCause:
          issue.aiAnalysis?.probableRootCause ||
          "Not available",

        // AI recommended historical fix
        aiRecommendedFix:
          issue.aiAnalysis?.recommendedFix ||
          "Not available",

        // Actual developer fix, if available
        previousDeveloperFix:
          issue.resolutionVerification
            ?.developerFix ||
          "Not available",

        // Resolution verification summary
        resolutionVerification:
          issue.resolutionVerification
            ?.verificationSummary ||
          "Not available",

        // Final resolution recommendation
        finalRecommendation:
          issue.resolutionVerification
            ?.recommendation ||
          "Not available",

        similarity: Number(
          issue.similarity.toFixed(3)
        ),

      }));

    return historicalResolutions;

  } catch (error) {

    console.error(
      "Historical Resolution Retrieval Error:",
      error
    );

    throw new Error(
      error.message ||
      "Failed to retrieve historical resolutions"
    );
  }
};
// ========================================
// BUILD HISTORICAL RESOLUTION RAG CONTEXT
// ========================================

const buildHistoricalResolutionContext = (
  resolutions
) => {

  if (
    !resolutions ||
    resolutions.length === 0
  ) {
    return (
      "No similar resolved or closed historical " +
      "issues were found."
    );
  }

  return resolutions
    .map((issue, index) => {

      return `

HISTORICAL RESOLVED ISSUE ${index + 1}

Issue ID:
${issue.issueId}

Title:
${issue.title}

Description:
${issue.description}

Status:
${issue.status}

Category:
${issue.category}

Severity:
${issue.severity}

Priority:
${issue.priority}

Affected Module:
${issue.affectedModule}

Previous Root Cause:
${issue.previousRootCause}

Previous AI Recommended Fix:
${issue.aiRecommendedFix}

Previous Developer Fix:
${issue.previousDeveloperFix}

Resolution Verification:
${issue.resolutionVerification}

Final Resolution Recommendation:
${issue.finalRecommendation}

Similarity Score:
${issue.similarity}

`;

    })
    .join(
      "\n\n--------------------------------\n\n"
    );
};
// ========================================
// RAG DUPLICATE BUG DETECTION
// ========================================

const detectDuplicateIssues = async (
  issueText,
  userId,
  currentIssueId = null,
  limit = 5
) => {
  try {
    if (!issueText || !issueText.trim()) {
      throw new Error(
        "Issue text is required for duplicate detection"
      );
    }

    // Generate embedding for the current issue
    const issueEmbedding = await generateEmbedding(
      issueText.trim()
    );

    // Get historical issues belonging to this user
    const query = {
      reportedBy: userId,
      embedding: { $exists: true, $ne: [] },
    };

    // Prevent the issue from matching itself
    if (currentIssueId) {
      query._id = { $ne: currentIssueId };
    }

    const issues = await Issue.find(query).lean();

    // Calculate similarity with existing issues
    const matches = issues
      .map((issue) => ({
        ...issue,
        similarity: cosineSimilarity(
          issueEmbedding,
          issue.embedding
        ),
      }))
      .filter((issue) => issue.similarity >= 0.65)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    // Determine duplicate status
    const exactDuplicate = matches.find(
      (issue) => issue.similarity >= 0.90
    );

    const possibleDuplicate = matches.find(
      (issue) =>
        issue.similarity >= 0.75 &&
        issue.similarity < 0.90
    );

    return {
      duplicateDetected: matches.length > 0,

      duplicateType: exactDuplicate
        ? "High confidence duplicate"
        : possibleDuplicate
        ? "Possible duplicate"
        : "Related issue",

      highestSimilarity:
        matches.length > 0
          ? Number(matches[0].similarity.toFixed(3))
          : 0,

      matches: matches.map((issue) => ({
        issueId: issue._id,
        title: issue.title,
        description: issue.description,
        status: issue.status,
        priority: issue.priority,
        category: issue.category,
        affectedModule: issue.affectedModule,
        similarity: Number(
          issue.similarity.toFixed(3)
        ),
      })),
    };
  } catch (error) {
    console.error(
      "RAG Duplicate Detection Error:",
      error
    );

    throw new Error(
      error.message ||
        "Failed to detect duplicate issues"
    );
  }
};

// ========================================
// EXPORT
// ========================================

module.exports = {
  retrieveRelevantIssues,
  buildRagContext,
  detectDuplicateIssues,
   retrieveHistoricalResolutions,
  buildHistoricalResolutionContext,
};