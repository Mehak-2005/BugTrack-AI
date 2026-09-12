import React, { useState } from "react";

export default function AutoReproduceModal({ isOpen, onClose, scriptData, loading, issueTitle }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (scriptData?.code) {
      navigator.clipboard.writeText(scriptData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.72)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#ffffff",
          width: "100%",
          maxWidth: "700px",
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 24px",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: "18px", color: "#702f43", fontWeight: 700 }}>
              🤖 Auto-Reproduce Script Generator
            </h3>
            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
              {issueTitle || "Defect Automated Reproduction"}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              color: "#64748b",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px", maxHeight: "70vh", overflowY: "auto" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 10px" }}>
              <p style={{ color: "#702f43", fontWeight: 600, fontSize: "15px", margin: 0 }}>
                Synthesizing DOM actions & generating Playwright spec...
              </p>
            </div>
          ) : scriptData ? (
            <div>
              <p style={{ margin: "0 0 12px", fontSize: "13.5px", color: "#334155", lineHeight: 1.5 }}>
                {scriptData.explanation}
              </p>

              {/* Code Container */}
              <div
                style={{
                  backgroundColor: "#0f172a",
                  borderRadius: "10px",
                  padding: "16px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                    borderBottom: "1px solid #334155",
                    paddingBottom: "8px",
                  }}
                >
                  <span style={{ color: "#94a3b8", fontSize: "12px", fontFamily: "monospace" }}>
                    📄 {scriptData.testFileName}
                  </span>
                  <button
                    onClick={handleCopy}
                    style={{
                      background: copied ? "#16a34a" : "#334155",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      padding: "4px 10px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "background 0.15s ease",
                    }}
                  >
                    {copied ? "✓ Copied" : "Copy Code"}
                  </button>
                </div>

                <pre
                  style={{
                    margin: 0,
                    color: "#38bdf8",
                    fontFamily: "Consolas, Monaco, monospace",
                    fontSize: "13px",
                    lineHeight: "1.5",
                    overflowX: "auto",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {scriptData.code}
                </pre>
              </div>
            </div>
          ) : (
            <p style={{ color: "#64748b", textAlign: "center" }}>No script available.</p>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "#702f43",
              color: "#ffffff",
              border: "none",
              padding: "8px 20px",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}