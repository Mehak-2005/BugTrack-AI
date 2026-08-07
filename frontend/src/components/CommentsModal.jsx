import { useEffect } from "react";
import Modal from "./Modal";

export default function CommentsModal({
  open,
  onClose,
  issue,
  comments,
  commentsLoading,
  commentText,
  setCommentText,
  addComment,
  deleteComment,
  commentSubmitting,
}) {

   console.log("===== COMMENTS MODAL =====");
  console.log("open:", open);
  console.log("issue:", issue);
  
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!issue) return null;

  // ============================
  // FORMAT DATE
  // ============================

  function formatCommentDate(date) {
    const d = new Date(date);
    const today = new Date();

    if (d.toDateString() === today.toDateString()) {
      return `Today • ${d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    return (
      d.toLocaleDateString([], {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) +
      " • " +
      d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title=""
      width="760px"
    >
      {/* HEADER */}

      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#702f43",
            fontSize: "28px",
          }}
        >
          💬 Comments
        </h2>

        <p
          style={{
            marginTop: "8px",
            color: "#777",
            fontSize: "15px",
          }}
        >
          Issue : <strong>{issue.title}</strong>
        </p>
      </div>

      {/* COMMENTS */}

      <div
        style={{
          height: "320px",
          overflowY: "auto",
          marginBottom: "20px",
          paddingRight: "10px",
        }}
      >
        {commentsLoading ? (
          <p style={{ textAlign: "center" }}>
            Loading comments...
          </p>
        ) : (comments[issue._id] || []).length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
            }}
          >
            <div
              style={{
                fontSize: "55px",
              }}
            >
              💬
            </div>

            <h2
              style={{
                color: "#4b3b3f",
                marginBottom: "10px",
              }}
            >
              No Comments Yet
            </h2>

            <p
              style={{
                color: "#888",
                maxWidth: "380px",
                margin: "0 auto",
                lineHeight: "1.7",
              }}
            >
              Start the discussion by posting the first
              comment on this issue.
            </p>
          </div>
        ) : (
          (comments[issue._id] || []).map((comment) => (
            <div
              key={comment._id}
              style={{
                background: "#ffffff",
                border: "1px solid #eee",
                borderRadius: "14px",
                padding: "18px",
                marginBottom: "15px",
                boxShadow: "0 5px 16px rgba(0,0,0,.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "15px",
                }}
              >
                {/* USER */}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg,#702f43,#91465d)",
                      color: "#fff",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: "700",
                      fontSize: "16px",
                      flexShrink: 0,
                    }}
                  >
                    {(comment.user?.name || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong
                      style={{
                        color: "#702f43",
                        fontSize: "17px",
                      }}
                    >
                      {comment.user?.name || "User"}
                    </strong>

                    <div
                      style={{
                        fontSize: "12px",
                        color: "#888",
                        marginTop: "4px",
                      }}
                    >
                      {comment.createdAt
                        ? formatCommentDate(comment.createdAt)
                        : ""}
                    </div>
                  </div>
                </div>

                {/* DELETE */}

                <button
                  onClick={() =>
                    deleteComment(issue._id, comment._id)
                  }
                  style={{
                    border: "none",
                    background: "#fdecef",
                    color: "#b4233f",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "13px",
                  }}
                >
                  🗑 Delete
                </button>
              </div>

              {/* COMMENT */}

              <div
                style={{
                  marginTop: "18px",
                  color: "#555",
                  lineHeight: "1.8",
                  fontSize: "15px",
                }}
              >
                {comment.text}
              </div>
            </div>
          ))
        )}
      </div>

      {/* FOOTER */}

      <textarea
        rows={4}
        value={commentText[issue._id] || ""}
        placeholder="Write your comment..."
        onChange={(e) =>
          setCommentText((prev) => ({
            ...prev,
            [issue._id]: e.target.value,
          }))
        }
        style={{
          width: "100%",
          padding: "15px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          resize: "none",
          fontSize: "15px",
          boxSizing: "border-box",
        }}
      />

      {/* Character Counter */}

      <div
        style={{
          textAlign: "right",
          color: "#999",
          fontSize: "12px",
          marginTop: "6px",
        }}
      >
        {(commentText[issue._id] || "").length} / 500
      </div>

      {/* BUTTONS */}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
          marginTop: "15px",
        }}
      >
        <button
          onClick={onClose}
          style={{
            padding: "12px 22px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            background: "#fff",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Cancel
        </button>

        <button
          disabled={commentSubmitting === issue._id}
          onClick={() => addComment(issue._id)}
          style={{
            padding: "12px 24px",
            border: "none",
            borderRadius: "10px",
            background:
              "linear-gradient(135deg,#702f43,#91465d)",
            color: "#fff",
            cursor:
              commentSubmitting === issue._id
                ? "not-allowed"
                : "pointer",
            fontWeight: "700",
          }}
        >
          {commentSubmitting === issue._id
            ? "Posting..."
            : "Post Comment"}
        </button>
      </div>
    </Modal>
  );
}