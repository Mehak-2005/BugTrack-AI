const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

const {
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
      throw new Error(
        "AI returned an empty response"
      );
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
      "Resolution Recommendation JSON Parse Error:",
      error
    );

    throw new Error(
      "Failed to parse AI resolution recommendation"
    );
  }
};

// ========================================
// AI RESOLUTION RECOMMENDATION AGENT
// ========================================

const generateResolutionRecommendation = async ({
  title,
  description,
  category,
  severity,
  priority,
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
    // BUILD RESOLUTION QUERY
    // ========================================

    const resolutionQuery = `
Title:
${safeTitle}

Description:
${description.trim()}

Category:
${category || "Not available"}

Severity:
${severity || "Not available"}

Priority:
${priority || "Not available"}
`.trim();

    // ========================================
    // STEP 1:
    // RETRIEVE HISTORICAL RESOLUTIONS USING RAG
    // ========================================

    const historicalResolutions =
      await retrieveHistoricalResolutions(
        resolutionQuery,
        userId,
        currentIssueId,
        5
      );

    // ========================================
    // STEP 2:
    // BUILD HISTORICAL RESOLUTION CONTEXT
    // ========================================

    const historicalResolutionContext =
      buildHistoricalResolutionContext(
        historicalResolutions
      );

    // ========================================
    // STEP 3:
    // GEMINI MODEL
    // ========================================

    const model =
      genAI.getGenerativeModel({
        model: "gemini-3-flash-preview",
      });

    // ========================================
    // STEP 4:
    // BUILD AI RESOLUTION PROMPT
    // ========================================

    const prompt = `
You are an advanced AI Resolution Recommendation Agent
inside a software defect tracking platform called
BugTrack AI.

Your task is to recommend possible technical resolutions
for the current software defect.

Use:

1. Current defect information
2. Similar resolved or closed historical defects
   retrieved using RAG
3. Previous root causes
4. Previous AI recommended fixes
5. Previous developer fixes
6. Resolution verification information

IMPORTANT:

Historical resolutions are supporting evidence.
Do NOT blindly copy a previous fix.

The current issue may have a different underlying cause
even when it is semantically similar.

Clearly distinguish:

- Recommended resolution
- Supporting historical evidence
- Assumptions
- Information required before implementation
- Risks and validation steps

========================================

CURRENT ISSUE

========================================

Title:

${safeTitle}

Description:

${description.trim()}

Category:

${category || "Not available"}

Severity:

${severity || "Not available"}

Priority:

${priority || "Not available"}

========================================

HISTORICAL RESOLUTION KNOWLEDGE
RETRIEVED USING RAG

========================================

${historicalResolutionContext}

========================================

YOUR TASK

========================================

Generate a useful resolution recommendation for the
current defect.

Return ONLY valid JSON.

Do not use Markdown.

Do not use code fences.

Use exactly this structure:

{
  "resolutionSummary": "",

  "recommendedResolutions": [
    {
      "resolution": "",
      "confidence": 0,
      "reasoning": "",
      "implementationSteps": [
        ""
      ],
      "basedOnHistoricalIssueIds": []
    }
  ],

  "historicalEvidence": [
    {
      "issueId": "",
      "title": "",
      "similarity": 0,
      "relevance": ""
    }
  ],

  "implementationConsiderations": [
    ""
  ],

  "assumptions": [
    ""
  ],

  "informationRequiredBeforeFix": [
    ""
  ],

  "risks": [
    ""
  ],

  "validationSteps": [
    ""
  ]
}

========================================

RULES

========================================

1. Confidence must be a number between 0 and 100.

2. Do not claim that a resolution is guaranteed to fix
   the issue.

3. Use historical resolutions as evidence only.

4. If no relevant historical resolution exists, provide
   a cautious recommendation based only on the current
   issue information.

5. Implementation steps must be practical and technical.

6. Do not invent:
   - error messages
   - stack traces
   - HTTP status codes
   - browser information
   - operating system information
   - database errors
   - API responses

7. Historical issue IDs used in
   basedOnHistoricalIssueIds must come only from the
   provided historical resolution context.

8. Validation steps should help developers verify that
   the proposed resolution actually solves the issue.

9. Return valid JSON only.
`;

    // ========================================
    // STEP 5:
    // CALL GEMINI
    // ========================================

    const result =
      await model.generateContent(prompt);

    const response = result.response;

    const aiText = response.text();

    // ========================================
    // STEP 6:
    // PARSE AI RESPONSE
    // ========================================

    const recommendation =
      parseAIResponse(aiText);

    // ========================================
    // STEP 7:
    // RETURN COMPLETE RESULT
    // ========================================

    return {
      success: true,

      currentIssue: {
        title: safeTitle,
        description: description.trim(),
        category:
          category || "Not available",
        severity:
          severity || "Not available",
        priority:
          priority || "Not available",
      },

      rag: {
        historicalResolutionsFound:
          historicalResolutions.length,

        retrievedIssueIds:
          historicalResolutions.map(
            (issue) => issue.issueId
          ),
      },

      historicalResolutions,

      recommendation,
    };

  } catch (error) {

    console.error(
      "AI Resolution Recommendation Error:",
      error
    );

    throw new Error(
      error.message ||
      "Failed to generate resolution recommendation"
    );
  }
};

// ========================================
// EXPORT
// ========================================

module.exports = {
  generateResolutionRecommendation,
};