const { GoogleGenerativeAI } = require("@google/generative-ai");

// ==========================================
// GEMINI CONFIGURATION
// ==========================================

if (!process.env.GEMINI_API_KEY) {
  console.warn(
    "WARNING: GEMINI_API_KEY is missing from .env"
  );
}

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

// ==========================================
// GENERATE BUG REPORT
// ==========================================

const generateBugReport = async ({
  title,
  description,
  priority,
  projectName,
}) => {
  try {
    // Validate description
    if (!description || !description.trim()) {
      throw new Error("Bug description is required");
    }

    const safeTitle =
      title?.trim() || "Untitled Issue";

    const safeProject =
      projectName?.trim() || "Not specified";

    const safePriority =
      priority || "Medium";

    // Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    // ==========================================
    // PROMPT
    // ==========================================

    const prompt = `
You are an AI bug analysis assistant inside a software bug
lifecycle management platform called BugTrack AI.

Analyze the bug information provided by the user and generate
a professional bug report.

USER PROVIDED INFORMATION

Project:
${safeProject}

Issue Title:
${safeTitle}

Priority:
${safePriority}

Bug Description:
${description.trim()}

Generate the report using EXACTLY the following structure:

Title: ${safeTitle}

Project: ${safeProject}

Environment:
Browser: [Use the browser only if mentioned in the description, otherwise Unknown]
OS: [Use the operating system only if mentioned in the description, otherwise Unknown]

Steps to Reproduce:

1. [First logical step]
2. [Second logical step]
3. [Third logical step]
4. [Add additional steps only when useful]

Expected Result:
[Explain what should normally happen]

Actual Result:
[Explain what actually happens based on the user's description]

Priority:
${safePriority}

Severity:
[Low, Medium, High, or Critical]

Category:
[Classify the issue, for example Authentication, UI, Backend,
Database, Performance, Checkout, API, Navigation, Security, etc.]

Possible Cause:
[Provide a brief technical hypothesis about possible causes.
Clearly present it as a possible cause rather than a confirmed fact.]

Recommended Action:
[Provide practical debugging or investigation steps for the developer]

RULES:

1. Do not invent browser information.

2. Do not invent operating system information.

3. If Browser or OS is not provided, write "Unknown".

4. Do not invent error messages, HTTP status codes, stack traces,
   database errors, or API responses.

5. The Project field must contain exactly:
   ${safeProject}

6. The Title field must contain exactly:
   ${safeTitle}

7. The Priority field must contain exactly:
   ${safePriority}

8. Infer severity from the impact described by the user.

9. Possible Cause is a hypothesis, not a confirmed diagnosis.

10. Make Steps to Reproduce specific to the provided bug instead
    of using generic steps such as "Perform action".

11. Keep the report concise, professional, and useful to a software
    developer.

12. Do not use Markdown headings, markdown tables, or code fences.
    Return plain text only.
`;

    // ==========================================
    // CALL GEMINI
    // ==========================================

    const result = await model.generateContent(prompt);

    const response = result.response;

    const report = response.text();

    if (!report || !report.trim()) {
      throw new Error(
        "Gemini returned an empty bug report"
      );
    }

    return report.trim();

  } catch (error) {
    console.error(
      "Gemini Bug Report Error:",
      error
    );

    throw new Error(
      error.message ||
        "Failed to generate AI bug report"
    );
  }
};


// ==========================================
// AI BUG TRIAGE
// ==========================================
// Milestone 2:
// Automatically determine:
// 1. Bug Category
// 2. Bug Severity
// ==========================================

const analyzeBug = async ({ description }) => {
  try {
    // ==========================================
    // VALIDATE DESCRIPTION
    // ==========================================

    if (!description || !description.trim()) {
      throw new Error("Bug description is required");
    }

    // ==========================================
    // GEMINI MODEL
    // ==========================================

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    // ==========================================
    // AI TRIAGE PROMPT
    // ==========================================

    const prompt = `
You are an AI bug triage assistant inside a software
bug lifecycle management platform called BugTrack AI.

Analyze the following bug description and automatically
classify the bug.

BUG DESCRIPTION:

${description.trim()}

------------------------------------------

CATEGORY

Choose EXACTLY ONE category from the following list:

UI
Authentication
Backend
Database
API
Performance
Security
Navigation
Checkout
Other

------------------------------------------

SEVERITY

Choose EXACTLY ONE severity from:

Low
Medium
High
Critical

------------------------------------------

RETURN FORMAT

Return ONLY valid JSON.

Do NOT return:
- Markdown
- Code fences
- Explanations
- Additional text

The response MUST follow exactly this format:

{
  "category": "UI",
  "severity": "Medium"
}

------------------------------------------

RULES

1. Category must be one of the allowed categories.

2. Severity must be one of the allowed severity values.

3. Infer severity from the impact described in the bug.

4. Do not invent technical details.

5. If the category cannot be confidently determined,
   use "Other".

6. If severity cannot be confidently determined,
   use "Medium".

7. Analyze only the information provided in the
   bug description.

8. Do not assume a browser, operating system,
   database, API response, or error code unless
   it is explicitly mentioned.
`;

    // ==========================================
    // CALL GEMINI
    // ==========================================

    const result = await model.generateContent(prompt);

    const response = result.response;

    let text = response.text();

    if (!text || !text.trim()) {
      throw new Error(
        "Gemini returned an empty triage response"
      );
    }

    // ==========================================
    // CLEAN GEMINI RESPONSE
    // ==========================================

    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // ==========================================
    // PARSE JSON
    // ==========================================

    let analysis;

    try {
      analysis = JSON.parse(text);
    } catch (parseError) {
      console.error(
        "Invalid Gemini JSON response:",
        text
      );

      throw new Error(
        "Gemini returned an invalid triage response"
      );
    }

    // ==========================================
    // ALLOWED VALUES
    // ==========================================

    const validCategories = [
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

    const validSeverities = [
      "Low",
      "Medium",
      "High",
      "Critical",
    ];

    // ==========================================
    // VALIDATE CATEGORY
    // ==========================================

    if (
      !validCategories.includes(
        analysis.category
      )
    ) {
      analysis.category = "Other";
    }

    // ==========================================
    // VALIDATE SEVERITY
    // ==========================================

    if (
      !validSeverities.includes(
        analysis.severity
      )
    ) {
      analysis.severity = "Medium";
    }

    // ==========================================
    // RETURN TRIAGE RESULT
    // ==========================================

    return {
      category: analysis.category,
      severity: analysis.severity,
    };

  } catch (error) {
    console.error(
      "Gemini Bug Triage Error:",
      error
    );

    throw new Error(
      error.message ||
        "Failed to analyze bug"
    );
  }
};


// ==========================================
// EXPORT FUNCTIONS
// ==========================================

module.exports = {
  generateBugReport,
  analyzeBug,
};