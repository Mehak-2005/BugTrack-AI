const Issue = require('../models/Issue');
const Sprint = require('../models/Sprint');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const calculateSprintHealth = async (sprintId) => {
  const sprint = await Sprint.findById(sprintId).populate('project');
  if (!sprint) {
    throw new Error('Sprint not found');
  }

  // Inside sprintRadarService.js
const issues = await Issue.find({ sprint: sprintId })
  .populate({ path: 'assignedDeveloper', populate: { path: 'user', select: 'name email' } })
  .lean();

  const totalIssues = issues.length;
  const closedIssues = issues.filter(i => i.status === 'Closed' || i.status === 'Resolved').length;
  const openIssues = issues.filter(i => i.status !== 'Closed' && i.status !== 'Resolved');
  
  const now = new Date();
  const endDate = new Date(sprint.endDate);
  const diffTime = endDate - now;
  const remainingDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const developerWorkload = {};
  let criticalCount = 0;
  let highCount = 0;

  openIssues.forEach(issue => {
    if (issue.severity === 'Critical') criticalCount++;
    if (issue.severity === 'High') highCount++;

    const devName = issue.assignedTo ? issue.assignedTo.name : 'Unassigned';
    if (!developerWorkload[devName]) {
      developerWorkload[devName] = { total: 0, critical: 0, high: 0 };
    }
    developerWorkload[devName].total += 1;
    if (issue.severity === 'Critical') developerWorkload[devName].critical += 1;
    if (issue.severity === 'High') developerWorkload[devName].high += 1;
  });

  const prompt = `
You are a senior agile technical delivery manager evaluating a software sprint.
Analyze the following sprint performance metrics and output a JSON response evaluating sprint health and delivery risk.

Sprint Data:
- Sprint Name: "${sprint.name}"
- Days Remaining: ${remainingDays} days
- Total Defects: ${totalIssues}
- Resolved/Closed Defects: ${closedIssues}
- Open Defects: ${openIssues.length}
- Critical Severity Open: ${criticalCount}
- High Severity Open: ${highCount}
- Developer Workload Distribution: ${JSON.stringify(developerWorkload)}

Respond ONLY with valid JSON in this exact structure:
{
  "healthScore": 72,
  "riskLevel": "Moderate",
  "summary": "assessment",
  "keyBottlenecks": ["bottleneck 1"],
  "recommendations": ["recommendation 1"]
}
`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    const aiAssessment = JSON.parse(text);

    return {
      sprintMetrics: {
        totalIssues,
        closedIssues,
        openIssuesCount: openIssues.length,
        remainingDays,
        criticalCount,
        highCount,
        developerWorkload
      },
      aiAssessment
    };
  } catch (err) {
    const fallbackScore = Math.max(
      10,
      Math.round(100 - (criticalCount * 15 + highCount * 8 + (remainingDays === 0 ? 30 : 0)))
    );
    return {
      sprintMetrics: {
        totalIssues,
        closedIssues,
        openIssuesCount: openIssues.length,
        remainingDays,
        criticalCount,
        highCount,
        developerWorkload
      },
      aiAssessment: {
        healthScore: fallbackScore,
        riskLevel: fallbackScore < 50 ? 'High' : fallbackScore < 75 ? 'Moderate' : 'Low',
        summary: `${openIssues.length} defects remain with ${remainingDays} days left.`,
        keyBottlenecks: criticalCount > 0 ? [`${criticalCount} critical bugs are unresolved.`] : [],
        recommendations: ['Review open tickets with priority on critical/high items.']
      }
    };
  }
};

module.exports = { calculateSprintHealth };