export const generateAuditMarkdown = ({ stats, hotspots, recentCriticalIssues, projectsCount }) => {
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fragileList = (hotspots?.fragileModules || [])
    .map(
      (m) =>
        `- **${m.name}**: Fragility Index ${m.fragilityScore}% (${m.defectCount} defects, ${m.criticalCount} Critical/High)`
    )
    .join("\n");

  const criticalsList = (recentCriticalIssues || []).length > 0
    ? recentCriticalIssues
        .map(
          (i) =>
            `- **[${i.severity?.toUpperCase() || "CRITICAL"}]** ${i.title} (${i.project?.projectName || "General"}) - *Status: ${i.status || "Open"}*`
        )
        .join("\n")
    : "- No critical blockers currently open.";

  return `# 🛡️ DefectIQ Executive Quality & Architectural Audit Report
*Generated on: ${dateStr}*

---

## 1. Executive Summary & KPIs
- **Monitored Projects**: ${projectsCount ?? 0}
- **Total Defect Volume**: ${stats.total ?? 0}
- **Open Defects**: ${stats.open ?? 0}
- **Under Active Resolution (In Progress/Review)**: ${(stats.inProgress ?? 0) + (stats.inReview ?? 0)}
- **Closed/Resolved Quality Gate**: ${(stats.resolved ?? 0) + (stats.closed ?? 0)}
- **Average Defect Resolution Lead Time**: ${stats.avgResolutionTime ?? 0} hrs

---

## 2. AI Codebase Fragility & Hotspot Heatmap
${fragileList || "- No hotspot metrics registered."}

### 🧠 Architectural Risk Assessment:
> ${hotspots?.aiInsight?.architecturalRisk || "All core subsystems functioning within nominal parameters."}

### 💡 Recommended Engineering Mitigation:
> ${hotspots?.aiInsight?.recommendedAction || "Maintain current test coverage and sprint cadence."}

---

## 3. High-Priority Defect Register
${criticalsList}

---
*Report auto-compiled by DefectIQ Intelligent Defect Management System.*
`;
};