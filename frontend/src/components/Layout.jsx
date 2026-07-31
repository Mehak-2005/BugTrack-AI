import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  let user = null;

  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error(
      "Error reading user from localStorage:",
      error
    );
  }

  // User name
  const userName = user?.name || "User";

  // First letter for avatar
  const userInitial =
    userName.charAt(0).toUpperCase();

  // User role
  const userRole = user?.role || "Developer";

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="app-layout">

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside className="sidebar">

        {/* BRAND */}

        <div className="brand">

          <div className="brand-icon">
            B
          </div>

          <div>
            <h2>BugTrack AI</h2>
            <span>Bug Management</span>
          </div>

        </div>

        {/* ======================================
            NAVIGATION
        ====================================== */}

        <nav className="sidebar-nav">

          {/* DASHBOARD */}

          <NavLink to="/dashboard">
            <span>▦</span>
            Dashboard
          </NavLink>

          {/* PROJECTS */}

          <NavLink to="/projects">
            <span>◫</span>
            Projects
          </NavLink>

          {/* ISSUES */}

          <NavLink to="/issues">
            <span>◉</span>
            Issues
          </NavLink>

          {/* CREATE ISSUE */}

          <NavLink to="/create-issue">
            <span>＋</span>
            Create Issue
          </NavLink>

          {/* ACTIVITY HISTORY */}

          <NavLink to="/activity">
            <span>◷</span>
            Activity History
          </NavLink>

        </nav>

        {/* ======================================
            LOGOUT
        ====================================== */}

        <div className="sidebar-bottom">

          <button onClick={logout}>
            ↪ Logout
          </button>

        </div>

      </aside>

      {/* ======================================
          MAIN AREA
      ====================================== */}

      <main className="main-area">

        {/* ======================================
            TOP BAR
        ====================================== */}

        <header className="topbar">

          <div>
            <h3>BugTrack AI</h3>
          </div>

          {/* LOGGED-IN USER */}

          <div className="topbar-user">

            <div className="notification">
              ♢
            </div>

            {/* Dynamic Avatar */}

            <div className="avatar">
              {userInitial}
            </div>

            {/* Dynamic User Information */}

            <div className="user-info">

              <strong>
                {userName}
              </strong>

              <span>
                {userRole}
              </span>

            </div>

          </div>

        </header>

        {/* ======================================
            PAGE CONTENT
        ====================================== */}

        <div className="page-content">
          <Outlet />
        </div>

      </main>

    </div>
  );
}