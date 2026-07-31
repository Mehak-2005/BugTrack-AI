import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    localStorage.getItem("rememberedEmail") || ""
  );

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: email.trim().toLowerCase(),
          password,
        }
      );

      console.log("LOGIN RESPONSE:", res.data);

      // Make sure backend returned token
      if (!res.data.token) {
        setError(
          "Login succeeded but no token was received."
        );
        return;
      }

      // Save JWT token
      localStorage.setItem(
        "token",
        res.data.token
      );

      // Save user information
      if (res.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );
      }

      // Remember email
      localStorage.setItem(
        "rememberedEmail",
        email.trim().toLowerCase()
      );

      // Navigate to dashboard
      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      console.error(
        "SERVER RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Decorative background */}
      <div className="login-decoration login-decoration-one" />
      <div className="login-decoration login-decoration-two" />

      <div className="login-container">

        {/* =====================================
            LEFT SIDE
        ====================================== */}

        <section className="login-hero">

          {/* BRAND */}

          <div className="login-brand">
            <div className="login-logo">
              B
            </div>

            <div>
              <h2>BugTrack AI</h2>
              <span>Bug Management</span>
            </div>
          </div>

          {/* HERO CONTENT */}

          <div className="login-hero-content">

            <div className="login-badge">
              Smart Issue Management
            </div>

            <h1>
              Track bugs.
              <br />
              <span>Build better.</span>
            </h1>

            <p>
              Manage projects, organize issues,
              track progress and generate structured
              bug reports from one workspace.
            </p>
          </div>

          <p className="login-hero-footer">
            BugTrack AI • Bug Lifecycle Management
          </p>

        </section>

        {/* =====================================
            RIGHT SIDE
        ====================================== */}

        <section className="login-form-section">

          <div className="login-card">

            {/* MOBILE LOGO */}

            <div className="login-mobile-logo">
              B
            </div>

            <div className="login-card-header">

              <p className="login-welcome">
                WELCOME BACK
              </p>

              <h2>Sign in to your workspace</h2>

              <p>
                Enter your account details to
                continue.
              </p>

            </div>

            {/* ERROR */}

            {error && (
              <div className="login-error">
                <span>!</span>
                {error}
              </div>
            )}

            {/* FORM */}

            <form
              onSubmit={handleLogin}
              className="login-form"
            >

              {/* EMAIL */}

              <div className="login-form-group">

                <label htmlFor="email">
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  disabled={loading}
                  autoComplete="email"
                />

              </div>

              {/* PASSWORD */}

              <div className="login-form-group">

                <label htmlFor="password">
                  Password
                </label>

                <div className="login-password-field">

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    disabled={loading}
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    disabled={loading}
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading
                  ? "Signing in..."
                  : "Sign In"}
              </button>

            </form>

            {/* REGISTER */}

            <div className="login-switch">

              <span>
                Don't have an account?
              </span>

              <Link to="/register">
                Create account
              </Link>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}