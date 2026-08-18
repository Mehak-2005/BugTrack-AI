import "./DeveloperRecommendationModal.css";

export default function DeveloperRecommendationModal({
  open,
  recommendation,
  issue,
  onClose,
  onAssign,
}) {
  if (!open || !recommendation) return null;

  return (
    <div className="modal-overlay">
      <div className="developer-modal">

        {/* HEADER */}
        <div className="developer-modal-header">
          <div>
            <h2>Recommended Developer</h2>
            <p>AI-powered developer recommendation</p>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="developer-modal-body">

          <h3>
            {recommendation.recommendedDeveloperName}
          </h3>

          <div className="match-score">
            {recommendation.matchScore}% Match
          </div>

          {/* ISSUE */}
          {issue && (
            <div className="recommendation-section">
              <h4>Issue to be Assigned</h4>

              <p>
                <strong>
                  {issue.title || "Untitled Issue"}
                </strong>
              </p>

              <p>
                {issue.description}
              </p>
            </div>
          )}

          {/* WHY */}
          <div className="recommendation-section">
            <h4>Why this developer?</h4>
            <p>{recommendation.reason}</p>
          </div>

          {/* SKILLS */}
          <div className="recommendation-section">
            <h4>Skill Match</h4>
            <p>{recommendation.skillMatch}</p>
          </div>

          {/* WORKLOAD */}
          <div className="recommendation-section">
            <h4>Workload Assessment</h4>
            <p>{recommendation.workloadAssessment}</p>
          </div>

          {/* EXPERIENCE */}
          <div className="recommendation-section">
            <h4>Experience Assessment</h4>
            <p>{recommendation.experienceAssessment}</p>
          </div>

        </div>

        {/* FOOTER */}
        <div className="developer-modal-footer">

          <button
            onClick={onClose}
          >
            Close
          </button>

          <button
            className="assign-developer-btn"
            onClick={() => onAssign(recommendation, issue)}
          >
            ✓ Assign Issue
          </button>

        </div>

      </div>
    </div>
  );
}