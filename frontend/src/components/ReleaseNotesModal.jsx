import React, { useState } from "react";

export default function ReleaseNotesModal({ isOpen, onClose, notesData, loading, sprintName }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyMarkdown = () => {
    if (notesData?.rawMarkdown) {
      navigator.clipboard.writeText(notesData.rawMarkdown);
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
        WebkitBackdropFilter: "blur(8px)",
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
          maxWidth: "680px",
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
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
            <h3 style={{ margin: 0, fontSize: "19px", fontWeight: 700, color: "#702f43" }}>
              📝 AI Release Notes & Changelog
            </h3>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              {sprintName} • {notesData?.version || "Draft"}
            </span>
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
        <div style={{ padding: "24px", maxHeight: "72vh", overflowY: "auto" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 10px" }}>
              <p style={{ color: "#702f43", fontWeight: 600, fontSize: "15px", margin: 0 }}>
                Synthesizing closed defects and drafting release changelog...
              </p>
            </div>
          ) : notesData ? (
            <div>
              {/* Executive Summary */}
              <div style={{ marginBottom: "18px" }}>
                <strong style={{ fontSize: "13px", textTransform: "uppercase", color: "#475569" }}>
                  Executive Summary
                </strong>
                <p
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderLeft: "4px solid #702f43",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    lineHeight: 1.5,
                    color: "#334155",
                    margin: "8px 0 0",
                  }}
                >
                  {notesData.summary}
                </p>
              </div>

              {/* Release Highlights */}
              {notesData.highlights?.length > 0 && (
                <div style={{ marginBottom: "18px" }}>
                  <strong style={{ fontSize: "13px", textTransform: "uppercase", color: "#166534" }}>
                    🚀 Release Highlights
                  </strong>
                  <ul style={{ margin: "8px 0 0", paddingLeft: "20px", color: "#334155" }}>
                    {notesData.highlights.map((h, i) => (
                      <li key={i} style={{ marginBottom: "4px", fontSize: "13.5px" }}>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Defect Fixes */}
              {notesData.keyFixes?.length > 0 && (
                <div style={{ marginBottom: "18px" }}>
                  <strong style={{ fontSize: "13px", textTransform: "uppercase", color: "#702f43" }}>
                    🛠 Resolved Defects & Impacts
                  </strong>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                    {notesData.keyFixes.map((fix, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: "#fffaf8",
                          border: "1px solid #eadbd6",
                          padding: "10px 14px",
                          borderRadius: "8px",
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: "13.5px", color: "#352b2d" }}>
                          {fix.title}
                        </div>
                        <div style={{ fontSize: "12px", color: "#75676a", marginTop: "3px" }}>
                          {fix.impact}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw Markdown Accordion/Preview */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <strong style={{ fontSize: "12px", textTransform: "uppercase", color: "#64748b" }}>
                    Raw Markdown (GitHub / Jira Format)
                  </strong>
                  <button
                    onClick={handleCopyMarkdown}
                    style={{
                      background: copied ? "#16a34a" : "#702f43",
                      color: "#fff",
                      border: "none",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {copied ? "✓ Copied" : "📋 Copy Changelog"}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={notesData.rawMarkdown || ""}
                  rows={6}
                  style={{
                    width: "100%",
                    fontFamily: "monospace",
                    fontSize: "12px",
                    background: "#0f172a",
                    color: "#38bdf8",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "none",
                    boxSizing: "border-box",
                    resize: "vertical",
                  }}
                />
              </div>
            </div>
          ) : (
            <p style={{ color: "#64748b", textAlign: "center" }}>No release notes available.</p>
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
              padding: "8px 22px",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "14px",
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