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

module.exports = {
  generateBugReport,
};