import React from "react";
import "./SprintRadarModal.css";

export default function SprintRadarModal({ isOpen, onClose, radarData, loading }) {
  if (!isOpen) return null;

  const assessment = radarData?.aiAssessment;
  const metrics = radarData?.sprintMetrics;

  const getScoreColor = (score) => {
    if (score >= 75) return "#16a34a"; // Green
    if (score >= 50) return "#d97706"; // Amber
    return "#dc2626"; // Red
  };

  return (
    <div className="sprint-radar-overlay" onClick={onClose}>
      <div className="sprint-radar-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sprint-radar-header">
          <h3>⚡ AI Sprint Health Radar</h3>
          <button className="sprint-radar-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="sprint-radar-body">
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 10px" }}>
              <p style={{ color: "#702f43", fontWeight: 600, fontSize: "15px", margin: 0 }}>
                Running AI predictive forecast on sprint backlog...
              </p>
            </div>
          ) : assessment ? (
            <div>
              {/* Score & Risk Box */}
              <div className="sprint-radar-metric-box">
                <div>
                  <div className="sprint-radar-metric-label">Delivery Probability</div>
                  <div className="sprint-radar-risk-text">
                    Risk Level:{" "}
                    <span style={{ color: getScoreColor(assessment.healthScore) }}>
                      {assessment.riskLevel}
                    </span>
                  </div>
                  <div className="sprint-radar-meta">
                    ⏳ {metrics?.remainingDays ?? 0} days remaining • 🐞 {metrics?.openIssuesCount ?? 0} open defects
                  </div>
                </div>

                <div
                  className="sprint-radar-score-wrap"
                  style={{ color: getScoreColor(assessment.healthScore) }}
                >
                  {assessment.healthScore}
                  <span>/100</span>
                </div>
              </div>

              {/* Assessment Section */}
              <div className="sprint-radar-section">
                <div className="sprint-radar-section-title" style={{ color: "#475569" }}>
                  📋 Executive Assessment
                </div>
                <p className="sprint-radar-assessment-card">{assessment.summary}</p>
              </div>

              {/* Bottlenecks */}
              {assessment.keyBottlenecks?.length > 0 && (
                <div className="sprint-radar-section">
                  <div className="sprint-radar-section-title" style={{ color: "#991b1b" }}>
                    ⚠️ Key Bottlenecks
                  </div>
                  <ul className="sprint-radar-list">
                    {assessment.keyBottlenecks.map((item, idx) => (
                      <li key={idx} className="sprint-radar-bottleneck-item">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {assessment.recommendations?.length > 0 && (
                <div className="sprint-radar-section">
                  <div className="sprint-radar-section-title" style={{ color: "#166534" }}>
                    💡 Recommended Mitigations
                  </div>
                  <ul className="sprint-radar-list">
                    {assessment.recommendations.map((item, idx) => (
                      <li key={idx} className="sprint-radar-action-item">
                        ✔ {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: "#64748b", textAlign: "center" }}>
              Unable to analyze sprint. Ensure sprint has issues linked to it.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="sprint-radar-footer">
          <button className="sprint-radar-btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}