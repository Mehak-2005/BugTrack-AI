import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function JoinProjectPage() {
  const navigate = useNavigate();

  const [passkey, setPasskey] = useState("");
  const [memberName, setMemberName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleJoin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!passkey.trim() || !memberName.trim()) {
      setError("Please enter both your name and the shared project passkey.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/projects/join", {
        passkey: passkey.trim().toUpperCase(),
        memberName: memberName.trim(),
      });

      console.log("JOIN RESPONSE:", res.data);

      if (res.data.success) {
        // Save token and team member info for session authorization
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userRole", "teamMember");
        localStorage.removeItem("loginType");

        setSuccessMsg(res.data.message);

        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1000);
      }
    } catch (err) {
      console.error("JOIN ERROR:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to join project. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fdf4f6", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "480px", background: "#ffffff", borderRadius: "20px", padding: "40px", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#2b2024", marginBottom: "8px" }}>Join Project Workspace</h1>
        <p style={{ color: "#777", marginBottom: "24px", fontSize: "14px" }}>Enter your registered name and the shared project passkey provided by your Team Lead.</p>

        {error && <div style={{ background: "#fff0f0", color: "#b42318", padding: "12px", borderRadius: "10px", marginBottom: "16px", fontSize: "14px" }}>⚠️ {error}</div>}
        {successMsg && <div style={{ background: "#eefbf3", color: "#16794c", padding: "12px", borderRadius: "10px", marginBottom: "16px", fontSize: "14px" }}>✓ {successMsg}</div>}

        <form onSubmit={handleJoin}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px", color: "#333" }}>Your Name (As added by Lead)</label>
            <input 
              type="text" 
              value={memberName} 
              onChange={(e) => setMemberName(e.target.value)} 
              placeholder="e.g. Sneha Reddy" 
              style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "10px", boxSizing: "border-box", fontSize: "14px" }}
              disabled={loading}
              required 
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px", color: "#333" }}>Shared Project Passkey</label>
            <input 
              type="text" 
              value={passkey} 
              onChange={(e) => setPasskey(e.target.value)} 
              placeholder="e.g. PROJ-A9F2" 
              style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "10px", letterSpacing: "1px", boxSizing: "border-box", textTransform: "uppercase", fontSize: "14px" }}
              disabled={loading}
              required 
            />
          </div>

          <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", background: "#6b2945", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "600", cursor: "pointer", fontSize: "15px" }}>
            {loading ? "Verifying..." : "Access Shared Dashboard"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link to="/login" style={{ color: "#6b2945", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
            ← Back to Team Lead Login
          </Link>
        </div>
      </div>
    </div>
  );
}