const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");
const Sprint = require("../models/Sprint");
const Issue = require("../models/Issue");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateSprintReleaseNotes = async (sprintId) => {
  const sprint = await Sprint.findById(sprintId).populate("project", "projectName");
  if (!sprint) throw new Error("Sprint not found");

  // Fetch all resolved or closed issues linked to this sprint
  const resolvedIssues = await Issue.find({
    sprint: sprintId,
    status: { $in: ["Resolved", "Closed"] },
  }).select("title description category severity priority defectType");

  const sprintName = sprint.name;
  const projectName = sprint.project?.projectName || "DefectIQ Project";

  // Graceful fallback if no issues are resolved yet
  if (!resolvedIssues || resolvedIssues.length === 0) {
    return {
      version: `${sprintName.replace(/\s+/g, "-")}-Release`,
      summary: `Sprint ${sprintName} currently has no defects marked as 'Resolved' or 'Closed'.`,
      highlights: ["Sprint iteration ongoing; no closed bug fixes ready for release packaging."],
      resolvedDefects: [],
      rawMarkdown: `## Release Notes - ${sprintName}\n\n*No resolved issues in this sprint iteration.*`,
    };
  }

  const prompt = `
You are a Lead Release Manager and Technical Writer.
Generate a structured, professional Release Changelog / Release Notes document for the completed sprint iteration.

Project: ${projectName}
Sprint: ${sprintName}

Resolved & Closed Defects (${resolvedIssues.length} items):
${JSON.stringify(resolvedIssues, null, 2)}

Instructions:
1. Provide a concise executive summary of the release.
2. Group key bug fixes by business impact.
3. List any critical stability or security enhancements.
4. Formulate clean raw markdown suitable for copy-pasting into GitHub Releases or Jira.
`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            version: { type: SchemaType.STRING },
            summary: { type: SchemaType.STRING },
            highlights: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
            },
            keyFixes: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  title: { type: SchemaType.STRING },
                  impact: { type: SchemaType.STRING },
                  category: { type: SchemaType.STRING },
                },
                required: ["title", "impact", "category"],
              },
            },
            rawMarkdown: { type: SchemaType.STRING },
          },
          required: ["version", "summary", "highlights", "keyFixes", "rawMarkdown"],
        },
      },
    });

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Release Notes generation error:", error);

    // Dynamic heuristic fallback
    const fixList = resolvedIssues.map(
      (i) => `* **${i.title}** (${i.category || "General"}): Resolved issue in ${i.defectType || "system"}.`
    );

    return {
      version: `${sprintName.replace(/\s+/g, "-")}-v1.0`,
      summary: `Release iteration for sprint ${sprintName} resolving ${resolvedIssues.length} defects across ${projectName}.`,
      highlights: [
        `Resolved ${resolvedIssues.length} issues in sprint iteration.`,
        "Verified core stability and user workflows.",
      ],
      keyFixes: resolvedIssues.map((i) => ({
        title: i.title,
        impact: `Fixes ${i.severity} severity bug in ${i.category || "module"}.`,
        category: i.category || "General",
      })),
      rawMarkdown: `## Release Notes: ${sprintName}\n\n${fixList.join("\n")}`,
    };
  }
};

module.exports = { generateSprintReleaseNotes };