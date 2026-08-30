import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api/invitations";

export default function JoinProjectPage() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [invitation, setInvitation] = useState(null);

  // ========================================
  // VERIFY INVITATION
  // ========================================

  const handleVerify = async (e) => {
    e.preventDefault();

    setError("");
    setInvitation(null);

    if (!code.trim()) {
      setError("Please enter your invitation code.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API}/verify`, {
        code: code.trim().toUpperCase(),
      });

      if (res.data.success) {
        setInvitation(res.data.invitation);
      }
    } catch (err) {
      console.error(
        "Invitation verification error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to verify invitation."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // CONTINUE TO LOGIN
  // ========================================

  const handleContinue = () => {
    if (!invitation) return;

    // Store invitation temporarily
    sessionStorage.setItem(
      "pendingInvitation",
      JSON.stringify(invitation)
    );

    navigate("/login");
  };

  return (
    <div style={styles.page}>

      <div style={styles.card}>

        {/* HEADER */}

        <div style={styles.icon}>
          🤝
        </div>

        <h1 style={styles.title}>
          Join Your Project
        </h1>

        <p style={styles.subtitle}>
          Enter the invitation code provided by
          your Team Lead.
        </p>

        {/* ERROR */}

        {error && (
          <div style={styles.error}>
            ⚠️ {error}
          </div>
        )}

        {!invitation ? (
          /* ====================================
             CODE FORM
          ==================================== */

          <form onSubmit={handleVerify}>

            <label style={styles.label}>
              Project Invitation Code
            </label>

            <input
              type="text"
              value={code}
              onChange={(e) =>
                setCode(e.target.value)
              }
              placeholder="Example: A72F91BC"
              maxLength={8}
              style={styles.input}
              disabled={loading}
            />

            <button
              type="submit"
              style={styles.primaryButton}
              disabled={loading}
            >
              {loading
                ? "Verifying..."
                : "Verify Invitation"}
            </button>

          </form>
        ) : (
          /* ====================================
             VERIFIED INVITATION
          ==================================== */

          <div>

            <div style={styles.success}>
              ✓ Invitation Verified
            </div>

            <div style={styles.details}>

              <div style={styles.detailRow}>
                <span>
                  Project
                </span>

                <strong>
                  {invitation.project?.name}
                </strong>
              </div>

              <div style={styles.detailRow}>
                <span>
                  Email
                </span>

                <strong>
                  {invitation.email}
                </strong>
              </div>

              <div style={styles.detailRow}>
                <span>
                  Your Role
                </span>

                <strong>
                  {invitation.role}
                </strong>
              </div>

              <div style={styles.detailRow}>
                <span>
                  Experience
                </span>

                <strong>
                  {invitation.experience} year(s)
                </strong>
              </div>

            </div>

            <p style={styles.info}>
              Please log in using the email address
              this invitation was sent to.
            </p>

            <button
              type="button"
              onClick={handleContinue}
              style={styles.primaryButton}
            >
              Continue to Login
            </button>

            <button
              type="button"
              onClick={() => {
                setInvitation(null);
                setCode("");
              }}
              style={styles.secondaryButton}
            >
              Use Another Code
            </button>

          </div>
        )}

        {/* BACK TO LOGIN */}

        <button
          type="button"
          onClick={() => navigate("/login")}
          style={styles.backButton}
        >
          ← Back to Login
        </button>

      </div>

    </div>
  );
}

// ========================================
// STYLES
// ========================================

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #fff9f7 0%, #fdf4f6 100%)",
    padding: "24px",
    boxSizing: "border-box",
  },

  card: {
    width: "100%",
    maxWidth: "480px",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "40px",
    boxSizing: "border-box",
    boxShadow:
      "0 20px 60px rgba(0, 0, 0, 0.12)",
    textAlign: "center",
  },

  icon: {
    fontSize: "48px",
    marginBottom: "12px",
  },

  title: {
    margin: "0 0 10px",
    fontSize: "30px",
    fontWeight: "700",
    color: "#2b2024",
  },

  subtitle: {
    margin: "0 0 28px",
    color: "#777",
    lineHeight: "1.6",
  },

  error: {
    background: "#fff0f0",
    color: "#b42318",
    padding: "12px 14px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "14px",
    textAlign: "left",
  },

  success: {
    background: "#eefbf3",
    color: "#16794c",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontWeight: "600",
  },

  label: {
    display: "block",
    textAlign: "left",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#44363b",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    fontSize: "16px",
    letterSpacing: "2px",
    outline: "none",
    marginBottom: "16px",
    textTransform: "uppercase",
  },

  details: {
    background: "#faf6f8",
    borderRadius: "14px",
    padding: "18px",
    marginBottom: "20px",
    textAlign: "left",
  },

  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    padding: "10px 0",
    borderBottom: "1px solid #eadfe3",
  },

  info: {
    color: "#666",
    fontSize: "14px",
    lineHeight: "1.6",
    marginBottom: "20px",
  },

  primaryButton: {
    width: "100%",
    border: "none",
    borderRadius: "10px",
    padding: "14px",
    background: "#6b2945",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },

  secondaryButton: {
    width: "100%",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "13px",
    background: "#ffffff",
    color: "#555",
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "10px",
  },

  backButton: {
    marginTop: "22px",
    border: "none",
    background: "transparent",
    color: "#6b2945",
    cursor: "pointer",
    fontSize: "14px",
  },
};