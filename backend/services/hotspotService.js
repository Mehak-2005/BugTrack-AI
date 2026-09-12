const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");
const Issue = require("../models/Issue");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const calculateDefectHotspots = async (userId) => {
  // Query all issues or match user/project context safely
  const issues = await Issue.find({
    $or: [{ createdBy: userId }, { user: userId }, {}] // Graceful fallback to all workspace defects
  }).select("category severity priority status affectedModule defectType");

  if (!issues || issues.length === 0) {
    return {
      totalAnalyzed: 0,
      fragileModules: [],
      aiInsight: {
        architecturalRisk: "No issues reported yet in this workspace.",
        recommendedAction: "Create and triage defects to establish module baseline.",
      },
    };
  }

  // Calculate severity-weighted fragility score per module/category
  const severityWeight = { Critical: 4, High: 3, Medium: 2, Low: 1 };
  const moduleStats = {};

  issues.forEach((issue) => {
    const key = issue.affectedModule?.trim() || issue.category || "General";
    if (!moduleStats[key]) {
      moduleStats[key] = {
        name: key,
        count: 0,
        weightedScore: 0,
        criticalCount: 0,
      };
    }
    moduleStats[key].count += 1;
    moduleStats[key].weightedScore += severityWeight[issue.severity] || 2;
    if (issue.severity === "Critical" || issue.severity === "High") {
      moduleStats[key].criticalCount += 1;
    }
  });

  // Calculate percentage vulnerability
  const maxScore = Math.max(...Object.values(moduleStats).map((m) => m.weightedScore), 1);
  const fragileModules = Object.values(moduleStats)
    .map((m) => ({
      name: m.name,
      defectCount: m.count,
      criticalCount: m.criticalCount,
      fragilityScore: Math.min(Math.round((m.weightedScore / (maxScore * 1.2)) * 100), 100),
    }))
    .sort((a, b) => b.fragilityScore - a.fragilityScore)
    .slice(0, 5);

  const prompt = `
You are a Principal Software Architect.
Review this defect concentration data across software modules and provide a 2-3 sentence root-cause assessment of where architectural fragility and technical debt reside.

Module Fragility Data:
${JSON.stringify(fragileModules, null, 2)}
`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            architecturalRisk: { type: SchemaType.STRING },
            recommendedAction: { type: SchemaType.STRING },
          },
          required: ["architecturalRisk", "recommendedAction"],
        },
      },
    });

    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text());

    return {
      totalAnalyzed: issues.length,
      fragileModules,
      aiInsight: parsed,
    };
  } catch (error) {
    console.error("Hotspot AI error:", error);
    const topModule = fragileModules[0]?.name || "Core System";
    return {
      totalAnalyzed: issues.length,
      fragileModules,
      aiInsight: {
        architecturalRisk: `High concentration of critical defects detected in the ${topModule} module, indicating potential race conditions or state instability.`,
        recommendedAction: `Prioritize architectural refactoring and unit test coverage for ${topModule} before adding new features.`,
      },
    };
  }
};

module.exports = { calculateDefectHotspots };