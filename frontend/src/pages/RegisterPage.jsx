import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }
      );

      // Remember the email for login
      localStorage.setItem(
        "rememberedEmail",
        email.trim().toLowerCase()
      );

      alert(
        "Account created successfully! Please login."
      );

      navigate("/login");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-decoration auth-decoration-one" />
      <div className="auth-decoration auth-decoration-two" />

      <div className="auth-container">

        {/* LEFT SIDE */}

        <section className="auth-hero">

          <div className="auth-brand">
            <div className="auth-logo">
              B
            </div>

            <span>BugTrack AI</span>
          </div>

          <div className="auth-hero-content">

            <span className="auth-badge">
              AI-powered issue management
            </span>

            <h1>
              Build better.
              <br />
              <span>Fix faster.</span>
            </h1>

            <p>
              Create your workspace and start
              managing projects, tracking bugs and
              generating intelligent bug reports with AI.
            </p>

            <div className="auth-features">
            </div>

          </div>

        </section>

        {/* REGISTER CARD */}

        <section className="auth-card">

          <div className="auth-card-header">

            <span className="mobile-logo">
              B
            </span>

            <h2>Create account</h2>

            <p>
              Start managing your bugs smarter.
            </p>

          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form
            onSubmit={handleRegister}
            className="auth-form"
          >

            <div className="form-group">

              <label>Full name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label>Email address</label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label>Password</label>

              <div className="password-field">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            <div className="form-group">

              <label>Confirm password</label>

              <input
                type="password"
                placeholder="Enter password again"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
              />

            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>

          </form>

          <div className="auth-switch">

            Already have an account?

            <Link to="/login">
              Sign in
            </Link>

          </div>

        </section>

      </div>

    </div>
  );
}