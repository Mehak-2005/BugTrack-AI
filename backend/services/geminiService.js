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
// 2. Affected Module
// 3. Defect Type
// 4. Bug Severity
// 5. Bug Priority
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

Your job is to intelligently classify a reported software
defect.

Analyze ONLY the information provided in the bug description.

BUG DESCRIPTION:

${description.trim()}

==========================================
1. CATEGORY
==========================================

Choose EXACTLY ONE category from:

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

==========================================
2. DEFECT TYPE
==========================================

Choose EXACTLY ONE defect type from:

Functional
UI
Performance
Security
Integration
Data
Other

Use:

Functional:
When a feature does not behave according to its expected
functionality.

UI:
When the problem primarily affects visual appearance,
layout, controls, responsiveness, or user interface behaviour.

Performance:
When the problem involves slow response, lag, timeout,
high resource usage, or degraded performance.

Security:
When the problem involves authentication vulnerabilities,
authorization problems, data exposure, or other security risks.

Integration:
When the problem occurs between two or more systems,
services, APIs, or external components.

Data:
When the problem involves incorrect, missing, corrupted,
or inconsistent data.

Other:
When the defect cannot confidently be classified.

==========================================
3. AFFECTED MODULE
==========================================

Identify the most likely application module affected.

Examples:

Payment Module
Authentication Module
Login Module
Checkout Module
User Profile Module
Dashboard Module
Database Layer
API Layer
Notification Module
Navigation Module
File Upload Module
Search Module
Other

Do NOT invent a highly specific module if the description
does not provide enough information.

If the module cannot be determined, use:

"Not specified"

==========================================
4. SEVERITY
==========================================

Choose EXACTLY ONE:

Low
Medium
High
Critical

Consider the impact described by the user.

Critical:
System-wide failure, major security issue, complete inability
to use a critical feature, or severe business impact.

High:
Major functionality is broken and significantly affects users.

Medium:
The defect affects functionality but has a reasonable
workaround or limited impact.

Low:
Minor issue with limited impact.

==========================================
5. PRIORITY
==========================================

Choose EXACTLY ONE:

Low
Medium
High
Critical

Priority should represent how urgently the development team
should address the defect.

==========================================
RETURN FORMAT
==========================================

Return ONLY valid JSON.

Do NOT return:

- Markdown
- Code fences
- Explanations
- Additional text

The response MUST follow exactly this structure:

{
  "category": "Checkout",
  "defectType": "Functional",
  "affectedModule": "Payment Module",
  "severity": "High",
  "priority": "High"
}

==========================================
RULES
==========================================

1. Category must be one of the allowed categories.

2. Defect type must be one of the allowed defect types.

3. Severity must be one of the allowed severity values.

4. Priority must be one of the allowed priority values.

5. Infer severity from the actual impact described.

6. Infer priority from the urgency and impact described.

7. Do not invent technical details.

8. Do not assume a browser, operating system, database,
   API response, stack trace, or error code unless explicitly
   mentioned.

9. If category cannot be confidently determined,
   use "Other".

10. If defect type cannot be confidently determined,
    use "Other".

11. If affected module cannot be confidently determined,
    use "Not specified".

12. If severity cannot be confidently determined,
    use "Medium".

13. If priority cannot be confidently determined,
    use "Medium".

14. Analyze only the information provided in the bug description.
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

    const validDefectTypes = [
      "Functional",
      "UI",
      "Performance",
      "Security",
      "Integration",
      "Data",
      "Other",
    ];

    const validModules = [
      "Payment Module",
      "Authentication Module",
      "Login Module",
      "Checkout Module",
      "User Profile Module",
      "Dashboard Module",
      "Database Layer",
      "API Layer",
      "Notification Module",
      "Navigation Module",
      "File Upload Module",
      "Search Module",
      "Other",
      "Not specified",
    ];

    const validSeverities = [
      "Low",
      "Medium",
      "High",
      "Critical",
    ];

    const validPriorities = [
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
    // VALIDATE DEFECT TYPE
    // ==========================================

    if (
      !validDefectTypes.includes(
        analysis.defectType
      )
    ) {
      analysis.defectType = "Other";
    }

    // ==========================================
    // VALIDATE AFFECTED MODULE
    // ==========================================

    if (
      !validModules.includes(
        analysis.affectedModule
      )
    ) {
      analysis.affectedModule = "Not specified";
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
    // VALIDATE PRIORITY
    // ==========================================

    if (
      !validPriorities.includes(
        analysis.priority
      )
    ) {
      analysis.priority = "Medium";
    }

    // ==========================================
    // RETURN TRIAGE RESULT
    // ==========================================

    return {
      category: analysis.category,
      defectType: analysis.defectType,
      affectedModule: analysis.affectedModule,
      severity: analysis.severity,
      priority: analysis.priority,
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

// ========================================
// AI RESOLUTION ASSISTANCE
// ========================================
// Helps developers understand and resolve
// software defects.
// ========================================

const generateResolutionAssistance = async ({
  title,
  description,
  category,
  severity,
  priority,
  report,
}) => {
  try {
    // ========================================
    // VALIDATE DESCRIPTION
    // ========================================

    if (!description || !description.trim()) {
      throw new Error(
        "Bug description is required"
      );
    }

    // ========================================
    // GEMINI MODEL
    // ========================================

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    // ========================================
    // RESOLUTION ASSISTANCE PROMPT
    // ========================================

    const prompt = `
You are an expert software debugging assistant
inside an intelligent software defect tracking
system.

Your job is to analyze the reported software defect
and provide practical resolution assistance to a
developer.

IMPORTANT RULES:

1. Do not claim that the root cause is definitely confirmed.

2. Treat the root cause as a probable technical hypothesis.

3. Do not invent information that is not present
   in the defect description.

4. Give practical and realistic debugging steps.

5. Give a realistic recommended fix.

6. Clearly distinguish between known information
   and AI assumptions.

7. Return ONLY valid JSON.

8. Do NOT return Markdown.

9. Do NOT return code fences.

10. Do NOT return additional explanation outside the JSON.

----------------------------------------
DEFECT INFORMATION
----------------------------------------

Title:
${title?.trim() || "Not provided"}

Description:
${description.trim()}

Category:
${category || "Not provided"}

Severity:
${severity || "Not provided"}

Priority:
${priority || "Not provided"}

Existing AI Report:
${report || "Not available"}

----------------------------------------
RETURN FORMAT
----------------------------------------

Return exactly this JSON structure:

{
  "probableRootCause": "string",
  "affectedModule": "string",
  "reasoningSummary": "string",
  "recommendedFix": "string",
  "debuggingSteps": [
    "step 1",
    "step 2",
    "step 3"
  ],
  "confidence": 0,
  "warnings": [
    "warning 1"
  ]
}

----------------------------------------
FIELD INSTRUCTIONS
----------------------------------------

probableRootCause:
Provide the most likely technical cause based
ONLY on the information provided.

affectedModule:
Identify the likely application module or component
affected by the defect.

reasoningSummary:
Briefly explain why the proposed root cause is
reasonable based on the reported behaviour.

recommendedFix:
Give a practical recommended solution.

debuggingSteps:
Provide clear steps a developer can follow to
investigate and resolve the issue.

confidence:
Return an integer between 0 and 100 representing
how confident the AI is in its analysis.

warnings:
Mention missing information, assumptions, or anything
the developer should verify before applying the fix.

----------------------------------------
IMPORTANT
----------------------------------------

If there is not enough information to identify
a specific root cause:

- Say that the root cause is uncertain.
- Give useful debugging steps.
- Do not invent technical details.
- Reduce the confidence value.
`;

    // ========================================
    // CALL GEMINI
    // ========================================

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    if (!response || !response.trim()) {
      throw new Error(
        "Gemini returned an empty resolution response"
      );
    }

    // ========================================
    // CLEAN GEMINI RESPONSE
    // ========================================

    const cleanedResponse = response
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // ========================================
    // PARSE JSON
    // ========================================

    let parsedResponse;

    try {
      parsedResponse = JSON.parse(
        cleanedResponse
      );
    } catch (parseError) {
      console.error(
        "Invalid Gemini Resolution JSON:",
        cleanedResponse
      );

      throw new Error(
        "Gemini returned an invalid resolution response"
      );
    }

    // ========================================
    // VALIDATE RESPONSE
    // ========================================

    const debuggingSteps =
      Array.isArray(
        parsedResponse.debuggingSteps
      )
        ? parsedResponse.debuggingSteps.filter(
            (step) =>
              typeof step === "string" &&
              step.trim()
          )
        : [];

    const warnings =
      Array.isArray(
        parsedResponse.warnings
      )
        ? parsedResponse.warnings.filter(
            (warning) =>
              typeof warning === "string" &&
              warning.trim()
          )
        : [];

    let confidence = 0;

    if (
      typeof parsedResponse.confidence ===
      "number"
    ) {
      confidence = Math.min(
        100,
        Math.max(
          0,
          Math.round(
            parsedResponse.confidence
          )
        )
      );
    }

    // ========================================
    // RETURN STRUCTURED RESULT
    // ========================================

    return {
      probableRootCause:
        typeof parsedResponse.probableRootCause ===
        "string"
          ? parsedResponse.probableRootCause.trim()
          : "",

      affectedModule:
        typeof parsedResponse.affectedModule ===
        "string"
          ? parsedResponse.affectedModule.trim()
          : "",

      reasoningSummary:
        typeof parsedResponse.reasoningSummary ===
        "string"
          ? parsedResponse.reasoningSummary.trim()
          : "",

      recommendedFix:
        typeof parsedResponse.recommendedFix ===
        "string"
          ? parsedResponse.recommendedFix.trim()
          : "",

      debuggingSteps,

      confidence,

      warnings,
    };

  } catch (error) {
    console.error(
      "Gemini Resolution Assistance Error:",
      error
    );

    throw new Error(
      error.message ||
        "Failed to generate AI resolution assistance"
    );
  }
};

// ==========================================
// AI TEST-CASE GENERATION
// ==========================================
// Generates validation test cases from the
// reported defect and AI resolution assistance.
//
// Test types:
// 1. Positive
// 2. Negative
// 3. Boundary
// 4. Regression
// ==========================================

const generateTestCases = async ({
  title,
  description,
  category,
  severity,
  priority,
  probableRootCause,
  recommendedFix,
}) => {
  try {
    // ==========================================
    // VALIDATE DESCRIPTION
    // ==========================================

    if (!description || !description.trim()) {
      throw new Error(
        "Bug description is required"
      );
    }

    // ==========================================
    // GEMINI MODEL
    // ==========================================

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    // ==========================================
    // TEST CASE GENERATION PROMPT
    // ==========================================

    const prompt = `
You are an expert software testing assistant
inside an intelligent software defect tracking
system.

Your job is to generate practical test cases
for a reported software defect.

The test cases will be used by developers and
testers to verify the defect fix.

IMPORTANT RULES:

1. Analyze ONLY the information provided.
2. Do not invent APIs, error codes, database
   structures, browser versions, or technical
   details that were not provided.
3. Test cases must be specific to this defect.
4. Include different testing perspectives.
5. Include positive, negative, boundary and
   regression tests whenever they are applicable.
6. If a test type is not applicable, do not
   force an unrealistic test.
7. Steps must be clear and actionable.
8. Expected results must be specific.
9. Return ONLY valid JSON.
10. Do NOT return Markdown.
11. Do NOT return code fences.
12. Do NOT return explanations outside JSON.

==========================================
DEFECT INFORMATION
==========================================

Title:
${title?.trim() || "Not provided"}

Description:
${description.trim()}

Category:
${category || "Not provided"}

Severity:
${severity || "Not provided"}

Priority:
${priority || "Not provided"}

==========================================
AI RESOLUTION INFORMATION
==========================================

Probable Root Cause:
${probableRootCause || "Not available"}

Recommended Fix:
${recommendedFix || "Not available"}

==========================================
REQUIRED TEST TYPES
==========================================

Generate useful test cases covering:

1. Positive
Verify that the corrected functionality
works normally with valid input.

2. Negative
Verify that invalid input or failure conditions
are handled correctly.

3. Boundary
Verify edge cases, limits, empty values,
maximum/minimum values, or unusual conditions
when applicable.

4. Regression
Verify that fixing this defect does not break
related existing functionality.

==========================================
RETURN FORMAT
==========================================

Return ONLY this JSON structure:

{
  "testCases": [
    {
      "testCaseId": "TC-001",
      "testType": "Positive",
      "scenario": "string",
      "steps": [
        "step 1",
        "step 2",
        "step 3"
      ],
      "expectedResult": "string",
      "priority": "High"
    }
  ]
}

==========================================
FIELD RULES
==========================================

testCaseId:
Use sequential IDs such as TC-001,
TC-002, TC-003.

testType:
Must be exactly one of:

Positive
Negative
Boundary
Regression

scenario:
Describe what is being tested.

steps:
Provide clear ordered actions.

expectedResult:
Describe what should happen if the
system is working correctly.

priority:
Choose exactly one:

Low
Medium
High
Critical

Use the importance of the test and the
impact of the defect to determine priority.

Generate between 4 and 8 useful test cases.
Do not create duplicate test cases.
`;

    // ==========================================
    // CALL GEMINI
    // ==========================================

    const result =
      await model.generateContent(prompt);

    const response =
      result.response.text();

    if (
      !response ||
      !response.trim()
    ) {
      throw new Error(
        "Gemini returned an empty test-case response"
      );
    }

    // ==========================================
    // CLEAN RESPONSE
    // ==========================================

    const cleanedResponse =
      response
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    // ==========================================
    // PARSE JSON
    // ==========================================

    let parsedResponse;

    try {
      parsedResponse =
        JSON.parse(cleanedResponse);

    } catch (parseError) {
      console.error(
        "Invalid Gemini Test Case JSON:",
        cleanedResponse
      );

      throw new Error(
        "Gemini returned an invalid test-case response"
      );
    }

    // ==========================================
    // VALIDATE TEST CASE ARRAY
    // ==========================================

    if (
      !parsedResponse ||
      !Array.isArray(
        parsedResponse.testCases
      )
    ) {
      throw new Error(
        "Gemini returned invalid test cases"
      );
    }

    // ==========================================
    // ALLOWED VALUES
    // ==========================================

    const validTestTypes = [
      "Positive",
      "Negative",
      "Boundary",
      "Regression",
    ];

    const validPriorities = [
      "Low",
      "Medium",
      "High",
      "Critical",
    ];

    // ==========================================
    // CLEAN AND VALIDATE TEST CASES
    // ==========================================

    const testCases =
      parsedResponse.testCases
        .filter(
          (testCase) =>
            testCase &&
            typeof testCase ===
              "object"
        )
        .map(
          (testCase, index) => {

            const testType =
              validTestTypes.includes(
                testCase.testType
              )
                ? testCase.testType
                : "Positive";

            const priority =
              validPriorities.includes(
                testCase.priority
              )
                ? testCase.priority
                : "Medium";

            const steps =
              Array.isArray(
                testCase.steps
              )
                ? testCase.steps
                    .filter(
                      (step) =>
                        typeof step ===
                          "string" &&
                        step.trim()
                    )
                    .map(
                      (step) =>
                        step.trim()
                    )
                : [];

            return {
              testCaseId:
                typeof testCase.testCaseId ===
                  "string" &&
                testCase.testCaseId.trim()
                  ? testCase.testCaseId.trim()
                  : `TC-${String(
                      index + 1
                    ).padStart(3, "0")}`,

              testType,

              scenario:
                typeof testCase.scenario ===
                  "string"
                  ? testCase.scenario.trim()
                  : "",

              steps,

              expectedResult:
                typeof testCase.expectedResult ===
                  "string"
                  ? testCase.expectedResult.trim()
                  : "",

              priority,
            };
          }
        )
        .filter(
          (testCase) =>
            testCase.scenario &&
            testCase.expectedResult &&
            testCase.steps.length > 0
        );

    // ==========================================
    // VALIDATE FINAL RESULT
    // ==========================================

    if (testCases.length === 0) {
      throw new Error(
        "No valid test cases were generated"
      );
    }

    // ==========================================
    // RETURN TEST CASES
    // ==========================================

    return testCases;

  } catch (error) {

    console.error(
      "Gemini Test Case Generation Error:",
      error
    );

    throw new Error(
      error.message ||
        "Failed to generate AI test cases"
    );
  }
};

// ==========================================
// AI DEVELOPER RECOMMENDATION
// ==========================================
// Recommends the most suitable developer for
// resolving a reported software defect.
// ==========================================

const recommendDeveloper = async ({
  title,
  description,
  category,
  severity,
  priority,
  affectedModule,
  developers,
}) => {
  try {
    // ==========================================
    // VALIDATE INPUT
    // ==========================================

    if (!description || !description.trim()) {
      throw new Error("Bug description is required");
    }

    if (!Array.isArray(developers) || developers.length === 0) {
      throw new Error("No developers available for recommendation");
    }

    // ==========================================
    // GEMINI MODEL
    // ==========================================

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    // ==========================================
    // DEVELOPER DATA
    // ==========================================

    const developerData = developers.map((developer) => ({
      id: developer._id,
      name: developer.name,
      skills: developer.skills || [],
      experience: developer.experience || 0,
      workload: developer.workload || 0,
      role: developer.role || "Developer",
    }));

    // ==========================================
    // PROMPT
    // ==========================================

    const prompt = `
You are an AI developer assignment assistant
inside an intelligent software defect tracking
system called BugTrack AI.

Your task is to recommend the MOST SUITABLE
developer to resolve the reported software defect.

Consider:

1. Developer skills
2. Developer experience
3. Current workload
4. Bug category
5. Bug severity
6. Bug priority
7. Affected module

Do NOT recommend a developer only because they
have the lowest workload.

The developer's technical skills and experience
must be relevant to the defect.

==========================================
DEFECT INFORMATION
==========================================

Title:
${title?.trim() || "Not provided"}

Description:
${description.trim()}

Category:
${category || "Not provided"}

Severity:
${severity || "Not provided"}

Priority:
${priority || "Not provided"}

Affected Module:
${affectedModule || "Not specified"}

==========================================
AVAILABLE DEVELOPERS
==========================================

${JSON.stringify(developerData, null, 2)}

==========================================
RETURN FORMAT
==========================================

Return ONLY valid JSON.

{
  "recommendedDeveloperId": "developer_id",
  "recommendedDeveloperName": "developer name",
  "matchScore": 0,
  "reason": "short explanation",
  "skillMatch": "short explanation",
  "workloadAssessment": "short explanation",
  "experienceAssessment": "short explanation",
  "alternativeDeveloperId": "developer_id"
}

==========================================
RULES
==========================================

1. recommendedDeveloperId MUST belong to one of
   the provided developers.

2. recommendedDeveloperName MUST match the
   selected developer.

3. matchScore must be an integer from 0 to 100.

4. ROLE MATCH IS VERY IMPORTANT.

   Match the developer's role to the type of
   defect before considering workload.

   Examples:

   - UI, frontend, React, CSS or browser issues
     → Prefer Frontend Developer.

   - Backend, server, Node.js, Express.js or
     API implementation issues
     → Prefer Backend Developer.

   - Testing, QA, validation, test cases,
     regression or API testing issues
     → Prefer Tester or QA Engineer.

   - Database, MongoDB or SQL issues
     → Prefer developers with relevant database
     skills.

   - Project planning, scheduling or coordination
     → Prefer Project Manager.

5. A developer whose ROLE directly matches the
   defect should normally be preferred over a
   developer whose role does not match, even if
   the second developer has a slightly lower
   workload.

6. After role relevance, consider technical
   skill relevance.

7. Consider experience as a supporting factor.

8. Consider workload only after role and skill
   relevance have been evaluated.

9. Do NOT recommend a Backend Developer for a
   testing/QA issue when a Tester or QA Engineer
   with relevant testing skills is available.

10. Do NOT recommend a Frontend Developer for a
    backend issue when a Backend Developer with
    relevant skills is available.
`;

    // ==========================================
    // CALL GEMINI
    // ==========================================

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    if (!response || !response.trim()) {
      throw new Error(
        "Gemini returned an empty developer recommendation"
      );
    }

    // ==========================================
    // CLEAN RESPONSE
    // ==========================================

    const cleanedResponse = response
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // ==========================================
    // PARSE JSON
    // ==========================================

    let parsedResponse;

    try {
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error(
        "Invalid Gemini Developer Recommendation JSON:",
        cleanedResponse
      );

      throw new Error(
        "Gemini returned an invalid developer recommendation"
      );
    }

    // ==========================================
    // VALIDATE RECOMMENDED DEVELOPER
    // ==========================================

    const recommendedDeveloper = developers.find(
      (developer) =>
        String(developer._id) ===
        String(parsedResponse.recommendedDeveloperId)
    );

    if (!recommendedDeveloper) {
      throw new Error(
        "Gemini recommended an invalid developer"
      );
    }

    // ==========================================
    // VALIDATE ALTERNATIVE DEVELOPER
    // ==========================================

    const alternativeDeveloper = developers.find(
      (developer) =>
        String(developer._id) ===
        String(parsedResponse.alternativeDeveloperId)
    );

    // ==========================================
    // VALIDATE SCORE
    // ==========================================

    let matchScore = Number(
      parsedResponse.matchScore
    );

    if (isNaN(matchScore)) {
      matchScore = 0;
    }

    matchScore = Math.min(
      100,
      Math.max(0, Math.round(matchScore))
    );

    // ==========================================
    // RETURN RESULT
    // ==========================================

    return {
      recommendedDeveloperId:
        recommendedDeveloper._id,

      recommendedDeveloperName:
        recommendedDeveloper.name,

      matchScore,

      reason:
        typeof parsedResponse.reason === "string"
          ? parsedResponse.reason.trim()
          : "",

      skillMatch:
        typeof parsedResponse.skillMatch === "string"
          ? parsedResponse.skillMatch.trim()
          : "",

      workloadAssessment:
        typeof parsedResponse.workloadAssessment === "string"
          ? parsedResponse.workloadAssessment.trim()
          : "",

      experienceAssessment:
        typeof parsedResponse.experienceAssessment === "string"
          ? parsedResponse.experienceAssessment.trim()
          : "",

      alternativeDeveloperId:
        alternativeDeveloper
          ? alternativeDeveloper._id
          : null,
    };

  } catch (error) {

    console.error(
      "Gemini Developer Recommendation Error:",
      error
    );

    throw new Error(
      error.message ||
      "Failed to recommend developer"
    );
  }
};

// ==========================================
// AI RESOLUTION VERIFICATION
// ==========================================
// Verifies whether the developer's proposed
// fix actually addresses the reported defect.
// ==========================================

const generateResolutionVerification = async ({
  title,
  description,
  category,
  severity,
  priority,
  probableRootCause,
  recommendedFix,
  developerFix,
}) => {
  try {

    // ==========================================
    // VALIDATE INPUT
    // ==========================================

    if (!description || !description.trim()) {
      throw new Error("Bug description is required");
    }

    if (!developerFix || !developerFix.trim()) {
      throw new Error("Developer fix description is required");
    }

    // ==========================================
    // GEMINI MODEL
    // ==========================================

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    // ==========================================
    // PROMPT
    // ==========================================

    const prompt = `
You are an AI software defect resolution verification
assistant inside an intelligent software defect tracking
system called BugTrack AI.

Your job is to verify whether a developer's proposed fix
actually addresses the reported software defect.

Do NOT assume that the developer's fix is correct.

Analyze the relationship between:

1. Original defect
2. Probable root cause
3. Recommended fix
4. Developer's proposed fix

==========================================
DEFECT INFORMATION
==========================================

Title:
${title?.trim() || "Not provided"}

Description:
${description.trim()}

Category:
${category || "Not provided"}

Severity:
${severity || "Not provided"}

Priority:
${priority || "Not provided"}

==========================================
AI ANALYSIS
==========================================

Probable Root Cause:
${probableRootCause || "Not available"}

Recommended Fix:
${recommendedFix || "Not available"}

==========================================
DEVELOPER'S FIX
==========================================

${developerFix.trim()}

==========================================
TASK
==========================================

Determine whether the developer's fix addresses
the probable root cause and reported defect.

Consider:

- Whether the root cause is addressed
- Whether the proposed fix matches the recommended fix
- Whether important parts of the defect remain unresolved
- Potential regression risk
- Additional testing required

==========================================
RETURN FORMAT
==========================================

Return ONLY valid JSON.

{
  "fixValidityScore": 0,
  "rootCauseAddressed": true,
  "verificationSummary": "string",
  "remainingIssues": [
    "string"
  ],
  "regressionRisk": "Low",
  "recommendedTests": [
    "string"
  ],
  "recommendation": "Approve resolution"
}

==========================================
RULES
==========================================

1. fixValidityScore must be an integer from 0 to 100.

2. rootCauseAddressed must be true or false.

3. regressionRisk must be exactly one of:
   Low
   Medium
   High

4. recommendation must be exactly one of:
   Approve resolution
   Needs review
   Reject resolution

5. Do not invent technical details.

6. If insufficient information is available,
   reduce the confidence represented by the score.

7. remainingIssues must contain only issues that
   are reasonably supported by the provided information.

8. recommendedTests should contain practical tests
   that can verify the proposed fix.

9. Return JSON only.
`;

    // ==========================================
    // CALL GEMINI
    // ==========================================

    const result =
      await model.generateContent(prompt);

    const response =
      result.response.text();

    if (!response || !response.trim()) {
      throw new Error(
        "Gemini returned an empty resolution verification response"
      );
    }

    // ==========================================
    // CLEAN RESPONSE
    // ==========================================

    const cleanedResponse =
      response
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    // ==========================================
    // PARSE JSON
    // ==========================================

    let parsedResponse;

    try {
      parsedResponse =
        JSON.parse(cleanedResponse);

    } catch (parseError) {

      console.error(
        "Invalid Gemini Resolution Verification JSON:",
        cleanedResponse
      );

      throw new Error(
        "Gemini returned an invalid resolution verification response"
      );
    }

    // ==========================================
    // VALIDATE SCORE
    // ==========================================

    let fixValidityScore =
      Number(parsedResponse.fixValidityScore);

    if (isNaN(fixValidityScore)) {
      fixValidityScore = 0;
    }

    fixValidityScore = Math.min(
      100,
      Math.max(
        0,
        Math.round(fixValidityScore)
      )
    );

    // ==========================================
    // VALIDATE ROOT CAUSE
    // ==========================================

    const rootCauseAddressed =
      Boolean(
        parsedResponse.rootCauseAddressed
      );

    // ==========================================
    // VALIDATE REGRESSION RISK
    // ==========================================

    const validRegressionRisks = [
      "Low",
      "Medium",
      "High",
    ];

    const regressionRisk =
      validRegressionRisks.includes(
        parsedResponse.regressionRisk
      )
        ? parsedResponse.regressionRisk
        : "Medium";

    // ==========================================
    // VALIDATE RECOMMENDATION
    // ==========================================

    const validRecommendations = [
      "Approve resolution",
      "Needs review",
      "Reject resolution",
    ];

    const recommendation =
      validRecommendations.includes(
        parsedResponse.recommendation
      )
        ? parsedResponse.recommendation
        : "Needs review";

    // ==========================================
    // VALIDATE ARRAYS
    // ==========================================

    const remainingIssues =
      Array.isArray(
        parsedResponse.remainingIssues
      )
        ? parsedResponse.remainingIssues
            .filter(
              (item) =>
                typeof item === "string" &&
                item.trim()
            )
            .map(
              (item) => item.trim()
            )
        : [];

    const recommendedTests =
      Array.isArray(
        parsedResponse.recommendedTests
      )
        ? parsedResponse.recommendedTests
            .filter(
              (test) =>
                typeof test === "string" &&
                test.trim()
            )
            .map(
              (test) => test.trim()
            )
        : [];

    // ==========================================
    // RETURN STRUCTURED RESULT
    // ==========================================

    return {
      fixValidityScore,

      rootCauseAddressed,

      verificationSummary:
        typeof parsedResponse.verificationSummary ===
        "string"
          ? parsedResponse.verificationSummary.trim()
          : "",

      remainingIssues,

      regressionRisk,

      recommendedTests,

      recommendation,
    };

  } catch (error) {

    console.error(
      "Gemini Resolution Verification Error:",
      error
    );

    throw new Error(
      error.message ||
      "Failed to verify AI resolution"
    );
  }
};
// ==========================================
// AI ANALYTICS INSIGHTS
// ==========================================

const generateAnalyticsInsights = async ({
  summary,
  defectsByStatus,
  defectsByPriority,
  defectsBySeverity,
  defectsByCategory,
  developerWorkload,
  defectTrends,
}) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const prompt = `
You are an AI analytics assistant inside an intelligent
software defect tracking platform called BugTrack AI.

Analyze the following dashboard analytics data and generate
useful insights for a development team.

ANALYTICS DATA:

Summary:
${JSON.stringify(summary, null, 2)}

Defects By Status:
${JSON.stringify(defectsByStatus, null, 2)}

Defects By Priority:
${JSON.stringify(defectsByPriority, null, 2)}

Defects By Severity:
${JSON.stringify(defectsBySeverity, null, 2)}

Defects By Category:
${JSON.stringify(defectsByCategory, null, 2)}

Developer Workload:
${JSON.stringify(developerWorkload, null, 2)}

Defect Trends:
${JSON.stringify(defectTrends, null, 2)}

Generate exactly 5 concise and useful insights.

The insights should consider:

1. Developer workload imbalance
2. Critical or high-severity defects
3. Defect status distribution
4. Defect trends over time
5. Recommended action for the development team

IMPORTANT RULES:

- Use ONLY the provided analytics data.
- Do not invent names, numbers, dates, or defects.
- Keep each insight concise and professional.
- Clearly distinguish observations from recommendations.
- Return ONLY valid JSON.
- Do not use Markdown or code fences.

Return the response in exactly this format:

{
  "insights": [
    {
      "type": "workload",
      "title": "Short insight title",
      "message": "Concise insight message"
    },
    {
      "type": "severity",
      "title": "Short insight title",
      "message": "Concise insight message"
    },
    {
      "type": "status",
      "title": "Short insight title",
      "message": "Concise insight message"
    },
    {
      "type": "trend",
      "title": "Short insight title",
      "message": "Concise insight message"
    },
    {
      "type": "recommendation",
      "title": "Recommended Action",
      "message": "Concise recommendation"
    }
  ]
}
`;

    const result = await model.generateContent(prompt);

    const response = result.response;

    const text = response.text();

    if (!text || !text.trim()) {
      throw new Error(
        "Gemini returned empty analytics insights"
      );
    }

    const cleanedResponse = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let parsedResponse;

    try {
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error(
        "Invalid Gemini Analytics JSON:",
        cleanedResponse
      );

      throw new Error(
        "Gemini returned an invalid analytics response"
      );
    }

    if (
      !parsedResponse ||
      !Array.isArray(parsedResponse.insights)
    ) {
      throw new Error(
        "Gemini returned invalid analytics insights"
      );
    }

    return parsedResponse.insights;
  } catch (error) {
    console.error(
      "Gemini Analytics Insights Error:",
      error
    );

    throw new Error(
      error.message ||
        "Failed to generate AI analytics insights"
    );
  }
};
// ==========================================
// EXPORT FUNCTIONS
// ==========================================

module.exports = {
  generateBugReport,
  analyzeBug,
  generateResolutionAssistance,
  generateTestCases,
  recommendDeveloper,
  generateResolutionVerification,
  generateAnalyticsInsights,
};