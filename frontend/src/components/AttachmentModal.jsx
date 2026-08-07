import React from "react";
import { useEffect } from "react";
import Modal from "./Modal";

export default function AttachmentModal({
  open,
  onClose,
  issue,
  attachments = [],
  selectedFile,
  onFileSelect,
  onUpload,
  onDelete,
  uploading,
  onPreview,
}) {
 
  if (!issue) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "700px",
          maxWidth: "90%",
          maxHeight: "80vh",
          overflowY: "auto",
          background: "#fff",
          borderRadius: "15px",
          padding: "25px",
          boxShadow: "0 20px 50px rgba(0,0,0,.25)",
        }}
      >
        {/* Header */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#702f43",
            }}
          >
            📎 Attachments
          </h2>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "28px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {/* Issue */}

        <div
          style={{
            background: "#f8f2f0",
            padding: "12px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <strong>Issue:</strong> {issue.title}
        </div>

        {/* Existing Attachments */}

        {attachments.length === 0 ? (
          <p>No attachments uploaded.</p>
        ) : (
          attachments.map((attachment) => (
            <div
              key={attachment._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #eee",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <span>
                📄{" "}
                {attachment.originalName ||
                  attachment.filename}
              </span>

              <div>
                <button
                  onClick={() =>
                    onPreview(attachment)
                  }
                  style={{
                    marginRight: "10px",
                  }}
                >
                  View
                </button>

                <button
                  onClick={() =>
                    onDelete(
                      issue._id,
                      attachment._id
                    )
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}

        <input
          type="file"
          onChange={(e) =>
            onFileSelect(
              e.target.files[0]
            )
          }
          style={{
            marginTop: "20px",
          }}
        />

        {selectedFile && (
          <p>
            Selected:
            <strong>
              {" "}
              {selectedFile.name}
            </strong>
          </p>
        )}

        <button
          onClick={onUpload}
          disabled={uploading}
          style={{
            width: "100%",
            marginTop: "15px",
            padding: "12px",
            border: "none",
            borderRadius: "10px",
            background:
              "#702f43",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {uploading
            ? "Uploading..."
            : "Upload Attachment"}
        </button>
      </div>
    </div>
  );
}