import React from "react";
import "./AIInvestigationModal.css";

export default function AIInvestigationModal({
  open,
  issue,
  result,
  loading,
  onClose,
}) {
  if (!open) return null;

  // The backend returns:
  // {
  //   success: true,
  //   currentIssue: {...},
  //   rag: {...},
  //   duplicateAnalysis: {...},
  //   investigation: {...}
  // }

  // ==========================================
// NORMALIZE BACKEND RESPONSE
// Backend response is wrapped inside:
// result.investigation
// ==========================================

const investigationResponse = result?.investigation;

const investigation =
  investigationResponse?.investigation ||
  investigationResponse ||
  null;

const duplicateAnalysis =
  investigationResponse?.duplicateAnalysis ||
  result?.duplicateAnalysis ||
  null;

const ragAnalysis =
  investigationResponse?.rag ||
  result?.rag ||
  null;

const currentIssue =
  investigationResponse?.currentIssue ||
  result?.currentIssue ||
  issue ||
  null;
  const getHighestSimilarity = () => {
  const values = [];

  const collectSimilarity = (obj) => {
    if (!obj || typeof obj !== "object") return;

    if (Array.isArray(obj)) {
      obj.forEach(collectSimilarity);
      return;
    }

    Object.entries(obj).forEach(([key, value]) => {
      const keyLower = key.toLowerCase();

      if (
        keyLower.includes("similarity") ||
        keyLower === "score"
      ) {
        const num = Number(value);

        if (!Number.isNaN(num) && num > 0 && num <= 1) {
          values.push(num);
        }
      }

      if (value && typeof value === "object") {
        collectSimilarity(value);
      }
    });
  };

  collectSimilarity(ragAnalysis);
  collectSimilarity(duplicateAnalysis);

  return values.length > 0 ? Math.max(...values) : 0;
};

const highestSimilarity = getHighestSimilarity();

  return (
    <div className="ai-investigation-overlay">
      <div className="ai-investigation-modal">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="ai-investigation-header">
          <div>
            <h2>🔍 AI Defect Investigation</h2>

            <p>
              AI-powered investigation using RAG,
              historical defects and Gemini.
            </p>
          </div>

          <button
            type="button"
            className="ai-investigation-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* ==========================================
            LOADING
        ========================================== */}

        {loading ? (
          <div className="ai-investigation-loading">

            <div className="ai-loading-spinner"></div>

            <h3>AI is investigating this defect...</h3>

            <p>
              Searching similar historical issues,
              checking duplicate patterns and analysing
              previous resolutions.
            </p>

          </div>
        ) : !investigation ? (
          <div className="ai-investigation-empty">

            <h3>No investigation result available</h3>

            <p>
              Start an AI investigation for this issue
              to see the analysis.
            </p>

          </div>
        ) : (
          <div className="ai-investigation-body">

            {/* ==========================================
                CURRENT ISSUE
            ========================================== */}

            <section className="investigation-section">

              <div className="section-title">
                <span>🐞</span>
                <h3>Issue Being Investigated</h3>
              </div>

              <div className="issue-summary-card">

                <h4>
                  {currentIssue?.title || "Untitled Issue"}
                </h4>

                <p>
                  {currentIssue?.description ||
  "No description available."}
                </p>

              </div>

            </section>

            {/* ==========================================
                RAG SUMMARY
            ========================================== */}

            <section className="investigation-section">

              <div className="section-title">
                <span>🧠</span>
                <h3>RAG Analysis</h3>
              </div>

              <div className="rag-stats">

                <div className="rag-stat-card">
                  <strong>
                    {ragAnalysis?.relevantIssuesFound ?? 0}
                  </strong>

                  <span>
                    Relevant Issues
                  </span>
                </div>

                <div className="rag-stat-card">
                  <strong>
                    {ragAnalysis?.historicalResolutionsFound ?? 0}
                  </strong>

                  <span>
                    Historical Resolutions
                  </span>
                </div>

                <div className="rag-stat-card">
                  <strong>
 {(highestSimilarity * 100).toFixed(1)}%
</strong>
                  <span>
                    Highest Similarity
                  </span>
                </div>

              </div>

            </section>

            {/* ==========================================
                INVESTIGATION SUMMARY
            ========================================== */}

            <section className="investigation-section">

              <div className="section-title">
                <span>📋</span>
                <h3>Investigation Summary</h3>
              </div>

              <div className="investigation-card">

                <p>
                  {investigation.investigationSummary ||
                    "No investigation summary available."}
                </p>

              </div>

            </section>

            {/* ==========================================
                DUPLICATE ASSESSMENT
            ========================================== */}

            <section className="investigation-section">

              <div className="section-title">
                <span>🔎</span>
                <h3>Duplicate Assessment</h3>
              </div>

              <div className="duplicate-card">

                <div className="duplicate-status">

                  <span
                    className={
                      duplicateAnalysis?.duplicateDetected
                        ? "duplicate-badge detected"
                        : "duplicate-badge not-detected"
                    }
                  >
                    {duplicateAnalysis?.duplicateDetected
                      ? "Possible Duplicate"
                      : "No Duplicate Detected"}
                  </span>

                </div>

                <div className="duplicate-details">

                  <div>
                    <strong>
                      Duplicate Type
                    </strong>

                    <span>
                      {duplicateAnalysis?.duplicateType ||
                        "Not available"}
                    </span>
                  </div>

                  <div>
                    <strong>
                      Highest Similarity
                    </strong>

                    <span>
  {highestSimilarity.toFixed(3)}
</span>
                  </div>

                  <div>
                    <strong>
                      AI Confidence
                    </strong>

                    <span>
                      {investigation
                        .duplicateAssessment
                        ?.confidence ?? 0}
                      %
                    </span>
                  </div>

                </div>

                <div className="reasoning-box">

                  <strong>
                    Reasoning
                  </strong>

                  <p>
                    {investigation
                      .duplicateAssessment
                      ?.reasoning ||
                      "No duplicate reasoning available."}
                  </p>

                </div>

              </div>

            </section>

            {/* ==========================================
                PROBABLE ROOT CAUSES
            ========================================== */}

            <section className="investigation-section">

              <div className="section-title">
                <span>🎯</span>
                <h3>Probable Root Causes</h3>
              </div>

              {investigation.probableRootCauses
                ?.length > 0 ? (

                <div className="root-cause-list">

                  {investigation.probableRootCauses.map(
                    (cause, index) => (

                      <div
                        className="root-cause-card"
                        key={index}
                      >

                        <div className="root-cause-header">

                          <h4>
                            {index + 1}.{" "}
                            {cause.cause ||
                              "Unknown Cause"}
                          </h4>

                          <span className="confidence-badge">
                            {cause.confidence ?? 0}%
                            confidence
                          </span>

                        </div>

                        <p>
                          {cause.reasoning ||
                            "No reasoning available."}
                        </p>

                      </div>

                    )
                  )}

                </div>

              ) : (
                <div className="investigation-card">
                  <p>
                    No probable root causes identified.
                  </p>
                </div>
              )}

            </section>

            {/* ==========================================
                REPRODUCTION STEPS
            ========================================== */}

            <section className="investigation-section">

              <div className="section-title">
                <span>🔁</span>
                <h3>Reproduction Steps</h3>
              </div>

              {investigation.reproductionSteps
                ?.length > 0 ? (

                <ol className="investigation-list">

                  {investigation.reproductionSteps.map(
                    (step, index) => (
                      <li key={index}>
                        {step}
                      </li>
                    )
                  )}

                </ol>

              ) : (
                <div className="investigation-card">
                  <p>
                    No reproduction steps available.
                  </p>
                </div>
              )}

            </section>

            {/* ==========================================
                EXPECTED BEHAVIOR
            ========================================== */}

            <section className="behavior-grid">

              <div className="behavior-card expected">

                <div className="behavior-title">
                  <span>✅</span>
                  <h3>Expected Behavior</h3>
                </div>

                <p>
                  {investigation.expectedBehavior ||
                    "Not available."}
                </p>

              </div>

              <div className="behavior-card actual">

                <div className="behavior-title">
                  <span>⚠️</span>
                  <h3>Likely Actual Behavior</h3>
                </div>

                <p>
                  {investigation.likelyActualBehavior ||
                    "Not available."}
                </p>

              </div>

            </section>

            {/* ==========================================
                MISSING INFORMATION
            ========================================== */}

            <section className="investigation-section">

              <div className="section-title">
                <span>❓</span>
                <h3>Missing Information</h3>
              </div>

              {investigation.missingInformation
                ?.length > 0 ? (

                <ul className="investigation-list">

                  {investigation.missingInformation.map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}

                </ul>

              ) : (
                <div className="investigation-card">
                  <p>
                    No additional information identified.
                  </p>
                </div>
              )}

            </section>

            {/* ==========================================
                INVESTIGATION QUESTIONS
            ========================================== */}

            <section className="investigation-section">

              <div className="section-title">
                <span>💡</span>
                <h3>Investigation Questions</h3>
              </div>

              {investigation.investigationQuestions
                ?.length > 0 ? (

                <ul className="investigation-list">

                  {investigation.investigationQuestions.map(
                    (question, index) => (
                      <li key={index}>
                        {question}
                      </li>
                    )
                  )}

                </ul>

              ) : (
                <div className="investigation-card">
                  <p>
                    No investigation questions generated.
                  </p>
                </div>
              )}

            </section>

            {/* ==========================================
                RECOMMENDED ACTIONS
            ========================================== */}

            <section className="investigation-section">

              <div className="section-title">
                <span>🛠️</span>
                <h3>Recommended Investigation Actions</h3>
              </div>

              {investigation.recommendedInvestigationActions
                ?.length > 0 ? (

                <ol className="investigation-list action-list">

                  {investigation.recommendedInvestigationActions.map(
                    (action, index) => (
                      <li key={index}>
                        {action}
                      </li>
                    )
                  )}

                </ol>

              ) : (
                <div className="investigation-card">
                  <p>
                    No recommended investigation actions.
                  </p>
                </div>
              )}

            </section>

            {/* ==========================================
                RISK ASSESSMENT
            ========================================== */}

            <section className="investigation-section">

              <div className="section-title">
                <span>🚨</span>
                <h3>Risk Assessment</h3>
              </div>

              <div className="risk-card">

                <div className="risk-header">

                  <span
                    className={`risk-badge ${
                      investigation.riskAssessment
                        ?.severity
                        ?.toLowerCase() || "low"
                    }`}
                  >
                    {investigation.riskAssessment
                      ?.severity || "Low"}
                  </span>

                </div>

                <p>
                  {investigation.riskAssessment
                    ?.reasoning ||
                    "No risk reasoning available."}
                </p>

              </div>

            </section>

            {/* ==========================================
                SIMILAR HISTORICAL PATTERNS
            ========================================== */}

            <section className="investigation-section">

              <div className="section-title">
                <span>📚</span>
                <h3>Similar Historical Patterns</h3>
              </div>

              {investigation.similarHistoricalPatterns
                ?.length > 0 ? (

                <ul className="investigation-list historical-list">

                  {investigation.similarHistoricalPatterns.map(
                    (pattern, index) => (
                      <li key={index}>
                        {pattern}
                      </li>
                    )
                  )}

                </ul>

              ) : (
                <div className="investigation-card">
                  <p>
                    No similar historical patterns found.
                  </p>
                </div>
              )}

            </section>

            {/* ==========================================
                RELATED ISSUE IDS
            ========================================== */}

            {investigation.relatedIssueIds?.length > 0 && (

              <section className="investigation-section">

                <div className="section-title">
                  <span>🔗</span>
                  <h3>Related Issue IDs</h3>
                </div>

                <div className="related-issues">

                  {investigation.relatedIssueIds.map(
                    (id, index) => (

                      <span
                        className="issue-id-badge"
                        key={index}
                      >
                        {String(id)}
                      </span>

                    )
                  )}

                </div>

              </section>

            )}

          </div>
        )}

        {/* ==========================================
            FOOTER
        ========================================== */}

        <div className="ai-investigation-footer">

          <button
            type="button"
            onClick={onClose}
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}