import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import "./ActivityPage.css";

const API_URL = "http://localhost:5000/api";

function ActivityPage() {
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] =
    useState("All");

  const token = localStorage.getItem("token");

  // ==========================================
  // FETCH ACTIVITIES
  // ==========================================

  const fetchActivities = useCallback(async () => {
    if (!token) {
      navigate("/login", {
        replace: true,
      });
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/activities`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch activity history"
        );
      }

      setActivities(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Activity fetch error:",
        error
      );

      setError(
        error.message ||
          "Failed to fetch activity history"
      );
    } finally {
      setLoading(false);
    }
  }, [navigate, token]);

  // ==========================================
  // LOAD ACTIVITIES
  // ==========================================

  useEffect(() => {
    if (!token) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    fetchActivities();
  }, [fetchActivities, navigate, token]);

  // ==========================================
  // ACTION TYPES FOR FILTER
  // ==========================================

  const actionTypes = useMemo(() => {
    const actions = activities
      .map((activity) => activity.action)
      .filter(Boolean);

    return ["All", ...new Set(actions)];
  }, [activities]);

  // ==========================================
  // FILTER ACTIVITIES
  // ==========================================

  const filteredActivities = useMemo(() => {
    const searchText = search
      .toLowerCase()
      .trim();

    return activities.filter((activity) => {
      const title =
        activity.issue?.title || "";

      const description =
        activity.issue?.description || "";

      const action =
        activity.action || "";

      const details =
        activity.details || "";

      const user =
        activity.user?.name || "";

      const project =
        activity.issue?.project?.projectName ||
        "";

      const matchesSearch =
        !searchText ||
        title
          .toLowerCase()
          .includes(searchText) ||
        description
          .toLowerCase()
          .includes(searchText) ||
        action
          .toLowerCase()
          .includes(searchText) ||
        details
          .toLowerCase()
          .includes(searchText) ||
        user
          .toLowerCase()
          .includes(searchText) ||
        project
          .toLowerCase()
          .includes(searchText);

      const matchesAction =
        actionFilter === "All" ||
        action === actionFilter;

      return matchesSearch && matchesAction;
    });
  }, [activities, search, actionFilter]);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ==========================================
  // ACTIVITY PAGE
  // Sidebar + Topbar come from Layout.jsx
  // ==========================================

  return (
    <div className="activity-page">
      <section className="activity-content">

        {/* ====================================
            PAGE HEADING
        ===================================== */}

        <div className="activity-heading">
          <div className="activity-title-area">

            <p className="activity-eyebrow">
              WORKSPACE ACTIVITY
            </p>

            <h1>Activity History</h1>

            <p className="activity-subtitle">
              Track changes and updates made to
              your issues.
            </p>

          </div>

          <div className="activity-count">
            <span>
              Recorded Activities
            </span>

            <strong>
              {activities.length}
            </strong>
          </div>
        </div>

        {/* ====================================
            SEARCH + FILTER
        ===================================== */}

        <div className="activity-controls">

          <input
            type="text"
            placeholder="Search issue, action, user or details..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={actionFilter}
            onChange={(e) =>
              setActionFilter(e.target.value)
            }
          >
            {actionTypes.map((action) => (
              <option
                key={action}
                value={action}
              >
                {action === "All"
                  ? "All Actions"
                  : action}
              </option>
            ))}
          </select>

        </div>

        {/* ====================================
            LOADING
        ===================================== */}

        {loading && (
          <div className="activity-message">
            Loading activity history...
          </div>
        )}

        {/* ====================================
            ERROR
        ===================================== */}

        {!loading && error && (
          <div className="activity-error">

            <div className="empty-icon">
              !
            </div>

            <h3>
              Unable to load activity history
            </h3>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={fetchActivities}
            >
              Try Again
            </button>

          </div>
        )}

        {/* ====================================
            EMPTY STATE
        ===================================== */}

        {!loading &&
          !error &&
          filteredActivities.length === 0 && (
            <div className="activity-empty">

              <div className="empty-icon">
                ◷
              </div>

              <h3>
                No activities found
              </h3>

              <p>
                {activities.length === 0
                  ? "Changes made to your issues will appear here."
                  : "No activity matches your search or filter."}
              </p>

            </div>
          )}

        {/* ====================================
            ACTIVITY TIMELINE
        ===================================== */}

        {!loading &&
          !error &&
          filteredActivities.length > 0 && (
            <div className="activity-timeline">

              {filteredActivities.map(
                (activity, index) => (
                  <article
                    className="activity-card"
                    key={activity._id}
                  >

                    {/* TIMELINE */}

                    <div className="timeline-column">

                      <div className="timeline-dot">
                        {index + 1}
                      </div>

                      {index !==
                        filteredActivities.length -
                          1 && (
                        <div className="timeline-line" />
                      )}

                    </div>

                    {/* ACTIVITY INFORMATION */}

                    <div className="activity-card-content">

                      <div className="activity-card-header">

                        <div className="activity-card-title">

                          <span className="activity-action">
                            {activity.action ||
                              "Activity"}
                          </span>

                          <h3>
  {activity.issue?.title ||
    activity.issueTitle ||
    "Deleted Issue"}
</h3>

                        </div>

                        <span className="activity-date">
                          {formatDate(
                            activity.createdAt
                          )}
                        </span>

                      </div>

                      {/* DETAILS */}

                      <p className="activity-details">
                        {activity.details ||
                          "Issue updated"}
                      </p>

                      {/* USER + STATUS */}

                      <div className="activity-meta">

                        <div className="activity-user">

                          <div className="small-avatar">
                            {activity.user?.name
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "U"}
                          </div>

                          <span>
                            {activity.user?.name ||
                              "User"}
                          </span>

                        </div>

                        {activity.issue?.status && (
                          <span className="activity-status">
                            {
                              activity.issue
                                .status
                            }
                          </span>
                        )}

                      </div>

                    </div>

                  </article>
                )
              )}

            </div>
          )}

      </section>
    </div>
  );
}

export default ActivityPage;