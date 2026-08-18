import React from "react";

const TestCasesModal = ({
  open,
  onClose,
  testCases = [],
}) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "1000px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#fff",
          borderRadius: "18px",
          padding: "25px",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2 style={{ margin: 0, color: "#7a2948" }}>
               AI Generated Test Cases
            </h2>

            <p style={{ color: "#777" }}>
              Test cases generated automatically by AI
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#f3dce4",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {/* TEST CASES */}
        {testCases.length === 0 ? (
          <p>No test cases available.</p>
        ) : (
          testCases.map((testCase, index) => (
            <div
              key={testCase._id || index}
              style={{
                border: "1px solid #ead5dc",
                borderRadius: "14px",
                padding: "20px",
                marginBottom: "18px",
                background: "#fffafa",
              }}
            >
              {/* TITLE */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: "#7a2948",
                  }}
                >
                  {testCase.testCaseId}
                </h3>

                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    background: "#f0dce3",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  {testCase.testType}
                </span>
              </div>

              {/* SCENARIO */}
              <div style={{ marginBottom: "15px" }}>
                <strong>Scenario</strong>

                <p style={{ marginTop: "6px" }}>
                  {testCase.scenario}
                </p>
              </div>

              {/* STEPS */}
              <div style={{ marginBottom: "15px" }}>
                <strong>Steps</strong>

                <ol>
                  {testCase.steps?.map((step, stepIndex) => (
                    <li key={stepIndex}>{step}</li>
                  ))}
                </ol>
              </div>

              {/* EXPECTED RESULT */}
              <div style={{ marginBottom: "15px" }}>
                <strong>Expected Result</strong>

                <p style={{ marginTop: "6px" }}>
                  {testCase.expectedResult}
                </p>
              </div>

              {/* PRIORITY */}
              <div>
                <strong>Priority: </strong>

                <span>
                  {testCase.priority}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TestCasesModal;