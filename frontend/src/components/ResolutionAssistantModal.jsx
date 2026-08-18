import React from "react";

const ResolutionAssistantModal = ({
  issue,
  analysis,
  loading,
  onClose,
  onRegenerate,
}) => {
  if (!issue) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "720px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow:
            "0 20px 60px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* ======================================
            HEADER
        ====================================== */}

        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 22px",
            background:
              "linear-gradient(135deg, #702f43, #91465d)",
            color: "#ffffff",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "19px",
                fontWeight: "700",
              }}
            >
              🤖 AI Resolution Assistance
            </h2>

            <p
              style={{
                margin: "5px 0 0",
                fontSize: "12px",
                opacity: 0.85,
              }}
            >
              Intelligent debugging assistance
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: "34px",
              height: "34px",
              border: "none",
              borderRadius: "50%",
              background:
                "rgba(255,255,255,0.15)",
              color: "#ffffff",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {/* ======================================
            ISSUE INFORMATION
        ====================================== */}

        <div
          style={{
            padding: "18px 22px 0",
          }}
        >
          <div
            style={{
              padding: "12px",
              background: "#faf5f3",
              border: "1px solid #eadfe0",
              borderRadius: "10px",
              marginBottom: "18px",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: "700",
                color: "#8b777d",
                textTransform: "uppercase",
                marginBottom: "5px",
              }}
            >
              Analyzing Defect
            </div>

            <div
              style={{
                color: "#4e4145",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {issue.title || "Untitled Issue"}
            </div>

            <div
              style={{
                marginTop: "5px",
                color: "#76676c",
                fontSize: "12px",
                lineHeight: "1.5",
              }}
            >
              {issue.description}
            </div>
          </div>
        </div>

        {/* ======================================
            LOADING STATE
        ====================================== */}

        {loading && (
          <div
            style={{
              padding: "45px 25px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "35px",
                marginBottom: "12px",
              }}
            >
              🤖
            </div>

            <h3
              style={{
                margin: "0 0 7px",
                color: "#702f43",
                fontSize: "17px",
              }}
            >
              Analyzing the defect...
            </h3>

            <p
              style={{
                margin: 0,
                color: "#8b777d",
                fontSize: "12px",
              }}
            >
              Gemini is generating debugging and
              resolution suggestions.
            </p>

            <div
              style={{
                margin: "20px auto 0",
                width: "180px",
                height: "5px",
                background: "#eadfe0",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "60%",
                  height: "100%",
                  background: "#702f43",
                  borderRadius: "10px",
                }}
              />
            </div>
          </div>
        )}

        {/* ======================================
            ANALYSIS RESULT
        ====================================== */}

        {!loading && analysis && (
          <div
            style={{
              padding: "0 22px 22px",
            }}
          >
            {/* CONFIDENCE */}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "14px",
              }}
            >
              <span
                style={{
                  padding: "7px 11px",
                  background: "#f4e2e5",
                  color: "#702f43",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "700",
                }}
              >
                🎯 {analysis.confidence || 0}% Confidence
              </span>
            </div>

            {/* ROOT CAUSE */}

            <section
              style={{
                marginBottom: "17px",
              }}
            >
              <h3 style={sectionTitle}>
                🔍 Probable Root Cause
              </h3>

              <p style={sectionText}>
                {analysis.probableRootCause ||
                  "No probable root cause available."}
              </p>
            </section>

            {/* AFFECTED MODULE */}

            <section
              style={{
                marginBottom: "17px",
              }}
            >
              <h3 style={sectionTitle}>
                📦 Affected Module
              </h3>

              <span
                style={{
                  display: "inline-block",
                  padding: "7px 11px",
                  background: "#eee3df",
                  color: "#702f43",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {analysis.affectedModule ||
                  "Not specified"}
              </span>
            </section>

            {/* REASONING */}

            <section
              style={{
                marginBottom: "17px",
              }}
            >
              <h3 style={sectionTitle}>
                💡 Reasoning
              </h3>

              <p style={sectionText}>
                {analysis.reasoningSummary ||
                  "No reasoning summary available."}
              </p>
            </section>

            {/* RECOMMENDED FIX */}

            <section
              style={{
                marginBottom: "17px",
                padding: "14px",
                background: "#f1f7f1",
                border:
                  "1px solid #d2e1d3",
                borderRadius: "10px",
              }}
            >
              <h3
                style={{
                  ...sectionTitle,
                  color: "#4c7155",
                }}
              >
                🔧 Recommended Fix
              </h3>

              <p
                style={{
                  ...sectionText,
                  color: "#4d6251",
                }}
              >
                {analysis.recommendedFix ||
                  "No recommended fix available."}
              </p>
            </section>

            {/* DEBUGGING STEPS */}

            {Array.isArray(
              analysis.debuggingSteps
            ) &&
              analysis.debuggingSteps.length >
                0 && (
                <section
                  style={{
                    marginBottom: "17px",
                  }}
                >
                  <h3 style={sectionTitle}>
                    🐛 Debugging Steps
                  </h3>

                  <ol
                    style={{
                      margin: 0,
                      paddingLeft: "21px",
                      color: "#5e5054",
                      fontSize: "13px",
                      lineHeight: "1.8",
                    }}
                  >
                    {analysis.debuggingSteps.map(
                      (step, index) => (
                        <li
                          key={index}
                          style={{
                            paddingLeft: "4px",
                          }}
                        >
                          {step}
                        </li>
                      )
                    )}
                  </ol>
                </section>
              )}

            {/* WARNINGS */}

            {Array.isArray(
              analysis.warnings
            ) &&
              analysis.warnings.length > 0 && (
                <section
                  style={{
                    marginBottom: "18px",
                    padding: "13px",
                    background: "#fff8e8",
                    border:
                      "1px solid #ead9a7",
                    borderRadius: "10px",
                  }}
                >
                  <h3
                    style={{
                      ...sectionTitle,
                      color: "#8b6c27",
                    }}
                  >
                    ⚠️ AI Warnings
                  </h3>

                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "19px",
                      color: "#75632d",
                      fontSize: "12px",
                      lineHeight: "1.7",
                    }}
                  >
                    {analysis.warnings.map(
                      (warning, index) => (
                        <li key={index}>
                          {warning}
                        </li>
                      )
                    )}
                  </ul>
                </section>
              )}

            {/* ACTIONS */}

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                type="button"
                onClick={onRegenerate}
                style={{
                  flex: 1,
                  padding: "11px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#702f43",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "12px",
                }}
              >
                🔄 Regenerate Analysis
              </button>

              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "11px 18px",
                  border:
                    "1px solid #d9c8cc",
                  borderRadius: "8px",
                  background: "#ffffff",
                  color: "#702f43",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "12px",
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* ======================================
            NO ANALYSIS
        ====================================== */}

        {!loading && !analysis && (
          <div
            style={{
              padding: "40px 25px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "35px",
                marginBottom: "10px",
              }}
            >
              ⚠️
            </div>

            <p
              style={{
                color: "#6f6266",
                fontSize: "13px",
              }}
            >
              No resolution analysis is
              available for this issue.
            </p>

            <button
              type="button"
              onClick={onRegenerate}
              style={{
                padding: "10px 18px",
                border: "none",
                borderRadius: "8px",
                background: "#702f43",
                color: "#ffffff",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              🤖 Generate Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


// ==========================================
// REUSABLE STYLES
// ==========================================

const sectionTitle = {
  margin: "0 0 6px",
  color: "#702f43",
  fontSize: "12px",
  fontWeight: "700",
  textTransform: "uppercase",
};

const sectionText = {
  margin: 0,
  color: "#5e5054",
  fontSize: "13px",
  lineHeight: "1.6",
};

export default ResolutionAssistantModal;