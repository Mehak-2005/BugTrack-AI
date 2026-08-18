import "./ResolutionVerificationModal.css";
export default function ResolutionVerificationModal({
  open,
  issue,
  onClose,
  onVerify,
  loading,
  verification,
  developerFix,
  setDeveloperFix,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay">

      <div className="resolution-verification-modal">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="resolution-verification-header">

          <div>
            <h2>AI Resolution Verification</h2>

            <p>
              Verify whether the proposed fix actually
              resolves this defect.
            </p>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        {/* ==========================================
            BODY
        ========================================== */}

        <div className="resolution-verification-body">

          {!verification ? (

            <>
              {/* ISSUE */}

              <div className="verification-issue">

                <span>DEFECT BEING VERIFIED</span>

                <h3>
                  {issue?.title || "Untitled Issue"}
                </h3>

                <p>
                  {issue?.description ||
                    "No description available."}
                </p>

              </div>

              {/* DEVELOPER FIX */}

              <div className="developer-fix-section">

                <label>
                  Developer's Proposed Fix
                </label>

                <textarea
                  value={developerFix}
                  onChange={(e) =>
                    setDeveloperFix(e.target.value)
                  }
                  placeholder="Describe the changes made to resolve this defect..."
                  rows={7}
                />

              </div>

              {/* VERIFY BUTTON */}

              <button
                className="verify-resolution-button"
                onClick={onVerify}
                disabled={
                  loading ||
                  !developerFix.trim()
                }
              >
                {loading
                  ? "AI Verifying Resolution..."
                  : "Verify Resolution"}
              </button>

            </>

          ) : (

            <>
              {/* ==========================================
                  VERIFICATION RESULT
              ========================================== */}

              <div className="verification-result">

                <div className="verification-score">

                  <span>FIX VALIDITY</span>

                  <strong>
                    {verification.fixValidityScore}%
                  </strong>

                </div>

                {/* ROOT CAUSE */}

                <div className="verification-card">

                  <h4>
                    Root Cause Addressed
                  </h4>

                  <p>
                    {verification.rootCauseAddressed
                      ? "Yes — the proposed fix addresses the probable root cause."
                      : "No — the proposed fix may not address the probable root cause."}
                  </p>

                </div>

                {/* SUMMARY */}

                <div className="verification-card">

                  <h4>
                    Verification Summary
                  </h4>

                  <p>
                    {verification.verificationSummary}
                  </p>

                </div>

                {/* REMAINING ISSUES */}

                <div className="verification-card">

                  <h4>
                    Remaining Issues
                  </h4>

                  {verification.remainingIssues?.length > 0 ? (

                    <ul>
                      {verification.remainingIssues.map(
                        (item, index) => (
                          <li key={index}>
                            {item}
                          </li>
                        )
                      )}
                    </ul>

                  ) : (

                    <p>
                      No remaining issues identified.
                    </p>

                  )}

                </div>

                {/* REGRESSION RISK */}

                <div className="verification-card">

                  <h4>
                    Regression Risk
                  </h4>

                  <span
                    className={`regression-risk ${verification.regressionRisk?.toLowerCase()}`}
                  >
                    {verification.regressionRisk}
                  </span>

                </div>

                {/* RECOMMENDED TESTS */}

                <div className="verification-card">

                  <h4>
                    Recommended Tests
                  </h4>

                  {verification.recommendedTests?.length > 0 && (

                    <ol>
                      {verification.recommendedTests.map(
                        (test, index) => (
                          <li key={index}>
                            {test}
                          </li>
                        )
                      )}
                    </ol>

                  )}

                </div>

                {/* FINAL RECOMMENDATION */}

                <div className="final-recommendation">

                  <span>
                    AI Recommendation
                  </span>

                  <strong>
                    {verification.recommendation}
                  </strong>

                </div>

              </div>

            </>
          )}

        </div>

        {/* ==========================================
            FOOTER
        ========================================== */}

        {verification && (

          <div className="resolution-verification-footer">

            <button
              onClick={onClose}
            >
              Close
            </button>

          </div>

        )}

      </div>

    </div>
  );
}