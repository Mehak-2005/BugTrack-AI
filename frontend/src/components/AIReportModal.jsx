import React from "react";
import Modal from "./Modal";

export default function AIReportModal({
  issue,
  onClose,
}) {
  if (!issue) return null;

  const copyReport = () => {
    navigator.clipboard.writeText(issue.report || "");

    alert("AI report copied to clipboard!");
  };

  return (
    <Modal
      open={!!issue}
      onClose={onClose}
      title=""
      width="850px"
    >
      {/* HEADER */}

      <div
        style={{
          marginBottom: "22px",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#702f43",
            fontSize: "30px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          🤖 AI Bug Analysis
        </h2>

        <p
          style={{
            marginTop: "8px",
            color: "#777",
            fontSize: "15px",
          }}
        >
          Generated using Gemini AI
        </p>
      </div>

      {/* ISSUE CARD */}

      <div
        style={{
          background: "#f9f4f2",
          border: "1px solid #ece1dc",
          borderRadius: "14px",
          padding: "18px",
          marginBottom: "22px",
        }}
      >
        <div
          style={{
            color: "#8a6a72",
            fontSize: "13px",
            marginBottom: "6px",
          }}
        >
          Issue
        </div>

        <div
          style={{
            color: "#702f43",
            fontWeight: "700",
            fontSize: "18px",
          }}
        >
          {issue.title}
        </div>

        <div
          style={{
            marginTop: "12px",
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              background: "#fff",
              border: "1px solid #e6d6d8",
              borderRadius: "25px",
              padding: "6px 14px",
              fontSize: "13px",
            }}
          >
            Priority : {issue.priority || "Medium"}
          </span>

          <span
            style={{
              background: "#fff",
              border: "1px solid #e6d6d8",
              borderRadius: "25px",
              padding: "6px 14px",
              fontSize: "13px",
            }}
          >
            Status : {issue.status || "Open"}
          </span>

          <span
            style={{
              background: "#fff",
              border: "1px solid #e6d6d8",
              borderRadius: "25px",
              padding: "6px 14px",
              fontSize: "13px",
            }}
          >
            Category : {issue.category || "General"}
          </span>
        </div>
      </div>

      {/* REPORT */}

      <div
        style={{
          height: "360px",
          overflowY: "auto",
          border: "1px solid #ececec",
          borderRadius: "16px",
          padding: "22px",
          background: "#ffffff",
          boxShadow: "0 8px 20px rgba(0,0,0,.05)",
          whiteSpace: "pre-wrap",
          lineHeight: "1.9",
          color: "#444",
          fontSize: "15px",
        }}
      >
        {issue.report ? (
          issue.report
        ) : (
          <div
            style={{
              textAlign: "center",
              marginTop: "90px",
            }}
          >
            <div
              style={{
                fontSize: "55px",
              }}
            >
              🤖
            </div>

            <h3
              style={{
                color: "#702f43",
                marginTop: "15px",
              }}
            >
              No AI Report Available
            </h3>

            <p
              style={{
                color: "#888",
                maxWidth: "420px",
                margin: "15px auto",
                lineHeight: "1.7",
              }}
            >
              AI analysis hasn't been generated for this issue yet.
            </p>
          </div>
        )}
      </div>

      {/* FOOTER */}

      <div
        style={{
          marginTop: "22px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            color: "#999",
            fontSize: "13px",
          }}
        >
          {issue.report
            ? `${issue.report.length} characters`
            : ""}
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          <button
            onClick={copyReport}
            style={{
              padding: "12px 20px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            📋 Copy Report
          </button>

          <button
            onClick={onClose}
            style={{
              padding: "12px 24px",
              border: "none",
              borderRadius: "10px",
              background:
                "linear-gradient(135deg,#702f43,#91465d)",
              color: "#fff",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}