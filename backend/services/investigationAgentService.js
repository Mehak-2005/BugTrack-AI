const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

const {
  retrieveRelevantIssues,
  buildRagContext,
  detectDuplicateIssues,
  retrieveHistoricalResolutions,
  buildHistoricalResolutionContext,
} = require("./ragService");

// ========================================
// GEMINI CONFIGURATION
// ========================================

if (!process.env.GEMINI_API_KEY) {
  console.warn(
    "WARNING: GEMINI_API_KEY is missing from .env"
  );
}

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

// ========================================
// PARSE GEMINI JSON RESPONSE
// ========================================

const parseAIResponse = (text) => {
  try {
    if (!text || !text.trim()) {
      throw new Error("AI returned an empty response");
    }

    let cleanText = text.trim();

    // Remove Markdown code fences if Gemini returns them
    cleanText = cleanText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanText);
  } catch (error) {
    console.error(
      "AI Investigation JSON Parse Error:",
      error
    );

    throw new Error(
      "Failed to parse AI investigation response"
    );
  }
};

// ========================================
// AI DEFECT INVESTIGATION AGENT
// ========================================

const investigateIssue = async ({
  title,
  description,
  userId,
  currentIssueId = null,
}) => {
  try {
    // ========================================
    // VALIDATION
    // ========================================

    if (!description || !description.trim()) {
      throw new Error(
        "Issue description is required"
      );
    }

    if (!userId) {
      throw new Error(
        "User ID is required"
      );
    }

    const safeTitle =
      title?.trim() || "Untitled Issue";

    // ========================================
    // BUILD INVESTIGATION QUERY
    // ========================================

    const investigationQuery = `
Title:
${safeTitle}

Description:
${description.trim()}
`.trim();

    // ========================================
    // STEP 1: RAG DUPLICATE DETECTION
    // ========================================

    const duplicateAnalysis =
      await detectDuplicateIssues(
        investigationQuery,
        userId,
        currentIssueId,
        5
      );

    // ========================================
    // STEP 2: RETRIEVE RELEVANT
    // HISTORICAL ISSUES
    // ========================================

    const relevantIssues =
      await retrieveRelevantIssues(
        investigationQuery,
        userId,
        currentIssueId,
        5
      );

    // ========================================
    // STEP 3: BUILD RAG CONTEXT
    // ========================================

    const ragContext =
      buildRagContext(relevantIssues);

      // ========================================
// STEP 3.5: RETRIEVE HISTORICAL RESOLUTIONS
// ========================================

const historicalResolutions =
  await retrieveHistoricalResolutions(
    investigationQuery,
    userId,
    currentIssueId,
    5
  );

const historicalResolutionContext =
  buildHistoricalResolutionContext(
    historicalResolutions
  );

    // ========================================
    // STEP 4: GEMINI MODEL
    // ========================================

    const model =
      genAI.getGenerativeModel({
        model: "gemini-3-flash-preview",
      });

    // ========================================
    // STEP 5: BUILD AI INVESTIGATION PROMPT
    // ========================================

    const prompt = `
You are an advanced AI Defect Investigation Agent
inside a software defect tracking platform called
BugTrack AI.

Your job is NOT simply to classify the issue.

Your job is to investigate the reported software
defect using:

1. The current issue description
2. Similar historical issues retrieved using RAG
3. Duplicate detection results

You must clearly distinguish:

- Confirmed facts
- Likely hypotheses
- Missing information
- Recommended investigation actions

Do NOT claim a root cause is confirmed unless the
provided information proves it.

========================================
CURRENT ISSUE
========================================

Title:

${safeTitle}

Description:

${description.trim()}

========================================
RAG DUPLICATE DETECTION RESULT
========================================

Duplicate Detected:

${duplicateAnalysis.duplicateDetected}

Duplicate Type:

${duplicateAnalysis.duplicateType}

Highest Similarity:

${duplicateAnalysis.highestSimilarity}

Duplicate Matches:

${JSON.stringify(
  duplicateAnalysis.matches,
  null,
  2
)}

========================================
RELEVANT HISTORICAL ISSUES
========================================

${ragContext}

========================================
HISTORICAL RESOLUTIONS
========================================

${historicalResolutionContext}

========================================
YOUR TASK
========================================

Perform a deep investigation of the current issue.

Return ONLY valid JSON.

Do not use Markdown.

Do not use code fences.

Use exactly this structure:

{
  "investigationSummary": "",

  "duplicateAssessment": {
    "isLikelyDuplicate": false,
    "confidence": 0,
    "reasoning": "",
    "relatedIssueIds": []
  },

  "probableRootCauses": [
    {
      "cause": "",
      "confidence": 0,
      "reasoning": ""
    }
  ],

  "reproductionSteps": [
    ""
  ],

  "expectedBehavior": "",

  "likelyActualBehavior": "",

  "missingInformation": [
    ""
  ],

  "investigationQuestions": [
    ""
  ],

  "recommendedInvestigationActions": [
    ""
  ],

  "riskAssessment": {
    "severity": "Low",
    "reasoning": ""
  },

  "similarHistoricalPatterns": [
    ""
  ]
}

========================================
RULES
========================================

1. Confidence must be a number between 0 and 100.

2. Do not invent:
   - browser information
   - operating system information
   - error messages
   - HTTP status codes
   - stack traces
   - API responses
   - database errors

3. If duplicate detection similarity is high, explain
   WHY the current issue is likely related or duplicated.

4. Use the historical issues as supporting evidence,
   but do not blindly assume their root cause is the
   root cause of the current issue.

5. Reproduction steps should be useful for a developer
   investigating the issue.

6. Missing information should identify what additional
   information would help confirm the cause.

7. Investigation questions should be practical questions
   a developer or tester can answer.

8. Recommended actions should be specific technical
   investigation actions.

9. Severity must be exactly one of:

   Low
   Medium
   High
   Critical

10. Return valid JSON only.
11. Use historical resolution data as supporting evidence
    when determining probable root causes and investigation
    actions.

12. If a similar resolved issue contains a previous developer
    fix or verified resolution, use it as historical evidence,
    but do not assume the same fix will solve the current issue.

13. Clearly distinguish between:
    - historical evidence
    - current issue evidence
    - AI hypotheses

14. Do not claim that a historical developer fix is the
    confirmed solution for the current issue unless the
    current issue evidence proves it.
`;

    // ========================================
    // STEP 6: CALL GEMINI
    // ========================================

    const result =
      await model.generateContent(prompt);

    const response =
      result.response;

    const aiText =
      response.text();

    // ========================================
    // STEP 7: PARSE AI RESPONSE
    // ========================================

    const investigation =
      parseAIResponse(aiText);

    // ========================================
    // STEP 8: RETURN COMPLETE RESULT
    // ========================================

    return {
      success: true,

      currentIssue: {
        title: safeTitle,
        description: description.trim(),
      },

      rag: {
  relevantIssuesFound:
    relevantIssues.length,

  retrievedIssueIds:
    relevantIssues.map(
      (issue) => issue._id
    ),

  historicalResolutionsFound:
    historicalResolutions.length,

  historicalResolutionIssueIds:
    historicalResolutions.map(
      (issue) => issue.issueId
    ),
},

      duplicateAnalysis,

      investigation,
    };
  } catch (error) {
    console.error(
      "AI Investigation Agent Error:",
      error
    );

    throw new Error(
      error.message ||
        "Failed to investigate issue"
    );
  }
};

// ========================================
// EXPORT
// ========================================

module.exports = {
  investigateIssue,
};