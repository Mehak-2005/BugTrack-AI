import React from "react";

export default function Modal({
  open,
  onClose,
  title,
  children,
  width = "700px",
}) {
  if (!open) return null;

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
        padding: "20px",
        zIndex: 9999,
        backdropFilter: "blur(5px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width,
          maxWidth: "95%",
          maxHeight: "90vh",
          background: "#fff",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0,0,0,.25)",
        }}
      >
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#702f43",
              fontSize: "24px",
            }}
          >
            {title}
          </h2>

          <button
            onClick={onClose}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "none",
              background: "#f5e8ec",
              color: "#702f43",
              fontSize: "22px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            padding: "24px",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}