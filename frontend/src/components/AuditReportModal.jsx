import React, { useState } from "react";

export default function AuditReportModal({ isOpen, onClose, markdownContent }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
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
          maxWidth: "740px",
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "88vh",
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
              📋 Executive QA & Architectural Audit
            </h3>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              Automated system-wide health and vulnerability summary
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

        {/* Action Bar */}
        <div
          style={{
            padding: "10px 24px",
            backgroundColor: "#fdf8f6",
            borderBottom: "1px solid #f1e5e1",
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleCopy}
            style={{
              background: copied ? "#16a34a" : "#702f43",
              color: "#ffffff",
              border: "none",
              padding: "7px 14px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {copied ? "✓ Copied" : "📋 Copy Markdown"}
          </button>
          <button
            onClick={handlePrint}
            style={{
              background: "#334155",
              color: "#ffffff",
              border: "none",
              padding: "7px 14px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            🖨️ Print / Save as PDF
          </button>
        </div>

        {/* Content View */}
        <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
          <pre
            style={{
              margin: 0,
              fontFamily: "inherit",
              fontSize: "13.5px",
              lineHeight: "1.6",
              color: "#334155",
              whiteSpace: "pre-wrap",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              padding: "20px",
              borderRadius: "12px",
            }}
          >
            {markdownContent}
          </pre>
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