
import { useEffect, useState } from "react";
import ResolutionAssistantModal from "../components/ResolutionAssistantModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import Modal from "../components/Modal";
import CommentsModal from "../components/CommentsModal";
import AttachmentModal from "../components/AttachmentModal";
import AIReportModal from "../components/AIReportModal";
import { getSprints } from "../services/sprintService";
import {
  getIssues,
  updateIssue,
} from "../services/issueService";
import {
  assignIssueToTeamMember,
} from "../services/teamService";
import TestCasesModal from "../components/TestCasesModal";
import DeveloperRecommendationModal from "../components/DeveloperRecommendationModal";
import ResolutionVerificationModal from "../components/ResolutionVerificationModal";
import AIInvestigationModal from "../components/AIInvestigationModal";
export default function IssuesPage() {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [commentModalIssue, setCommentModalIssue] = useState(null);

const [attachmentModalIssue, setAttachmentModalIssue] = useState(null);
  // =====================================================
// COMMENTS
// =====================================================
const [expandedComments, setExpandedComments] =useState(null);
 // ==========================================
// ATTACHMENT STATES
// ==========================================

const [expandedAttachments, setExpandedAttachments] =useState(null);

const [attachments, setAttachments] = useState({});

const [selectedFiles, setSelectedFiles] = useState({});

const [uploadingFile, setUploadingFile] = useState(null);
// ==========================================
// ATTACHMENT PREVIEW
// ==========================================

const [previewAttachment, setPreviewAttachment] =useState(null);

const [comments, setComments] = useState({});

const [commentText, setCommentText] =useState({});

const [commentsLoading, setCommentsLoading] =useState(null);

const [commentSubmitting, setCommentSubmitting] =useState(null);
const [selectedReport, setSelectedReport] = useState(null);
const [sprints, setSprints] = useState([]);
const [openIssueMenu, setOpenIssueMenu] = useState(null);
const [expandedIssueDetails, setExpandedIssueDetails] = useState(null);
// AI RESOLUTION ASSISTANCE
const [selectedResolutionIssue, setSelectedResolutionIssue] =useState(null);
const [resolutionLoadingId, setResolutionLoadingId] = useState(null);
const [showTestCasesModal, setShowTestCasesModal] = useState(false);
const [testCases, setTestCases] = useState([]);
const [generatingTestCases, setGeneratingTestCases] = useState(false);
const [recommendedDeveloper, setRecommendedDeveloper] = useState(null);
const [recommendedIssue, setRecommendedIssue] = useState(null);
const [showDeveloperModal, setShowDeveloperModal] = useState(false);
const [loadingRecommendation, setLoadingRecommendation] = useState(false);
const [selectedVerificationIssue, setSelectedVerificationIssue] =useState(null);
const [showVerificationModal, setShowVerificationModal] = useState(false);
const [verificationLoading, setVerificationLoading] = useState(false);
const [verificationResult, setVerificationResult] = useState(null);
const [developerFix, setDeveloperFix] = useState("")
const [investigationIssue, setInvestigationIssue] = useState(null);
const [investigationResult, setInvestigationResult] = useState(null);
const [investigationLoading, setInvestigationLoading] = useState(false);
const [showInvestigationModal, setShowInvestigationModal] = useState(false);
const token = localStorage.getItem("token");

  // =====================================================
  // AUTH CONFIG
  // =====================================================

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // =====================================================
  // FETCH ISSUES
  // =====================================================

  const fetchIssues = async () => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/issues",
        getAuthConfig()
      );

      setIssues(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching issues:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
        return;
      }

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load issues"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
    fetchSprints();
  }, []);

  const fetchSprints = async () => {
  try {
    const data = await getSprints();
    setSprints(data);
  } catch (err) {
    console.error(err);
  }
};

const generateTestCases = async (issueId) => {
  try {
    setGeneratingTestCases(true);

    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/ai/generate-tests/${issueId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to generate test cases"
      );
    }

    setTestCases(data.testCases || []);
    setShowTestCasesModal(true);

  } catch (error) {
    console.error("Test case generation error:", error);
    alert(error.message || "Failed to generate test cases");
  } finally {
    setGeneratingTestCases(false);
  }
};

// ==========================================
// AI DEVELOPER RECOMMENDATION
// ==========================================

const handleRecommendDeveloper = async (issue) => {
  try {
    setLoadingRecommendation(true);

    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/ai/recommend-developer/${issue._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to recommend developer"
      );
    }

    setRecommendedDeveloper(data.recommendation);
    setRecommendedIssue(issue);
    setShowDeveloperModal(true);

  } catch (error) {
    console.error(
      "Developer recommendation error:",
      error
    );

    alert(error.message);

  } finally {
    setLoadingRecommendation(false);
  }
};
// =====================================================
// ASSIGN RECOMMENDED DEVELOPER
// =====================================================

const handleAssignDeveloper = async (
  recommendation,
  issue
) => {
  try {
    if (!recommendation || !issue) {
      alert("Developer or issue information is missing.");
      return;
    }

    // ==========================================
    // GET RECOMMENDED DEVELOPER NAME
    // ==========================================

    const developerName =
      recommendation.recommendedDeveloperName;

    if (!developerName) {
      alert("Recommended developer name is missing.");
      return;
    }

    // ==========================================
    // GET TEAM MEMBERS
    // ==========================================

    const teamResponse =
      await axios.get(
        "http://localhost:5000/api/team",
        getAuthConfig()
      );

    const teamMembers =
      Array.isArray(teamResponse.data)
        ? teamResponse.data
        : [];

    // ==========================================
    // FIND RECOMMENDED TEAM MEMBER
    // ==========================================

    const member = teamMembers.find(
      (person) =>
        person.name?.trim().toLowerCase() ===
        developerName.trim().toLowerCase()
    );

    if (!member) {
      alert(
        `Could not find ${developerName} in your team members.`
      );

      return;
    }
 // ==========================================
// SAVE DEVELOPER ON THE ISSUE
// ==========================================

const res = await axios.put(
  `http://localhost:5000/api/issues/${issue._id}`,
  {
    assignedDeveloper: member._id,
  },
  getAuthConfig()
);

const updatedIssue = res.data.issue || res.data;

console.log("UPDATED ISSUE FROM BACKEND:", updatedIssue);

// Update issue immediately in UI
setIssues((previousIssues) =>
  previousIssues.map((existingIssue) =>
    existingIssue._id === issue._id
      ? {
          ...existingIssue,
          ...updatedIssue,
        }
      : existingIssue
  )
);

// ==========================================
// ADD ISSUE TO DEVELOPER'S TASKS
// ==========================================

await assignIssueToTeamMember(
  member._id,
  {
    issueId: issue._id,
    title: issue.title || "Untitled Issue",
    priority: issue.priority || "Medium",
  }
);

// Refresh issues from backend
await fetchIssues();

    // ==========================================
    // SUCCESS
    // ==========================================

    alert(
      `${developerName} has been assigned this issue successfully.`
    );

    // Close modal
    setShowDeveloperModal(false);

    // Clear selected recommendation
    setRecommendedDeveloper(null);
    setRecommendedIssue(null);

  } catch (error) {
    console.error(
      "Assign developer error:",
      error
    );

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login", {
        replace: true,
      });

      return;
    }

    alert(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to assign issue"
    );
  }
};
const handleVerifyResolution = async (issue) => {
  if (!developerFix.trim()) {
    alert("Please describe the developer's fix.");
    return;
  }

  try {
    setVerificationLoading(true);

    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/ai/verify-resolution/${issue._id}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          developerFix: developerFix.trim(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to verify resolution"
      );
    }

    setVerificationResult(data.verification);

  } catch (error) {

    console.error(
      "Resolution verification error:",
      error
    );

    alert(
      error.message ||
      "Failed to verify resolution"
    );

  } finally {
    setVerificationLoading(false);
  }
};
// =====================================================
// FETCH COMMENTS
// =====================================================

const fetchComments = async (issueId) => {
  try {
    setCommentsLoading(issueId);

    const res = await axios.get(
      `http://localhost:5000/api/comments/${issueId}`,
      getAuthConfig()
    );

    setComments((previous) => ({
      ...previous,
      [issueId]: Array.isArray(res.data)
        ? res.data
        : [],
    }));
  } catch (error) {
    console.error(
      "Error fetching comments:",
      error
    );

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login", {
        replace: true,
      });

      return;
    }

    alert(
      error.response?.data?.message ||
        "Failed to load comments"
    );
  } finally {
    setCommentsLoading(null);
  }
};

const toggleComments = async (issueId) => {
  if (expandedComments === issueId) {
    setExpandedComments(null);
    return;
  }

  setExpandedComments(issueId);

  await fetchComments(issueId);
};

const addComment = async (issueId) => {
  const text =
    commentText[issueId]?.trim();

  if (!text) {
    return;
  }

  try {
    setCommentSubmitting(issueId);

    const res = await axios.post(
      `http://localhost:5000/api/comments/${issueId}`,
      {
        text,
      },
      getAuthConfig()
    );

    const newComment = res.data.comment;

    setComments((previous) => ({
      ...previous,

      [issueId]: [
        ...(previous[issueId] || []),
        newComment,
      ],
    }));

    // Clear textarea
    setCommentText((previous) => ({
      ...previous,
      [issueId]: "",
    }));
  } catch (error) {
    console.error(
      "Error adding comment:",
      error
    );

    alert(
      error.response?.data?.message ||
        "Failed to add comment"
    );
  } finally {
    setCommentSubmitting(null);
  }
};

const deleteComment = async (
  issueId,
  commentId
) => {
  const confirmed = window.confirm(
    "Delete this comment?"
  );

  if (!confirmed) {
    return;
  }

  try {
    await axios.delete(
      `http://localhost:5000/api/comments/${commentId}`,
      getAuthConfig()
    );

    setComments((previous) => ({
      ...previous,

      [issueId]: (
        previous[issueId] || []
      ).filter(
        (comment) =>
          comment._id !== commentId
      ),
    }));
  } catch (error) {
    console.error(
      "Error deleting comment:",
      error
    );

    alert(
      error.response?.data?.message ||
        "Failed to delete comment"
    );
  }
};
  // =====================================================
  // UPDATE ISSUE FIELD
  // =====================================================

  const updateIssueField = async (id, field, value) => {
    try {
      setUpdatingId(id);

      const res = await axios.put(
        `http://localhost:5000/api/issues/${id}`,
        {
          [field]: value,
        },
        getAuthConfig()
      );

      const updatedIssue = res.data.issue || res.data;

      setIssues((previousIssues) =>
        previousIssues.map((issue) =>
          issue._id === id
            ? {
                ...issue,
                ...updatedIssue,
              }
            : issue
        )
      );

      return updatedIssue;
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
      console.error("Server response:", error.response?.data);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
        return null;
      }

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          `Failed to update ${field}`
      );

      return null;
    } finally {
      setUpdatingId(null);
    }
  };
  

  // =====================================================
  // DRAG AND DROP
  // =====================================================

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    // Dropped outside a valid column
    if (!over) {
      return;
    }

    const issueId = String(active.id);
    const newStatus = String(over.id);

    const validStatuses = [
      "Open",
      "In Progress",
      "In Review",
      "Resolved",
    ];

    if (!validStatuses.includes(newStatus)) {
      return;
    }

    const currentIssue = issues.find(
      (issue) => issue._id === issueId
    );

    if (!currentIssue) {
      return;
    }

    const oldStatus = currentIssue.status || "Open";

    // Nothing changed
    if (oldStatus === newStatus) {
      return;
    }

    // Optimistic UI update:
    // move card immediately
    setIssues((previousIssues) =>
      previousIssues.map((issue) =>
        issue._id === issueId
          ? {
              ...issue,
              status: newStatus,
            }
          : issue
      )
    );

    try {
      setUpdatingId(issueId);

      const res = await axios.put(
        `http://localhost:5000/api/issues/${issueId}`,
        {
          status: newStatus,
        },
        getAuthConfig()
      );

      const updatedIssue = res.data.issue || res.data;

      // Replace optimistic version with backend response
      setIssues((previousIssues) =>
        previousIssues.map((issue) =>
          issue._id === issueId
            ? {
                ...issue,
                ...updatedIssue,
              }
            : issue
        )
      );
    } catch (error) {
      console.error("Drag update failed:", error);
      console.error("Server response:", error.response?.data);

      // Roll back if backend update fails
      setIssues((previousIssues) =>
        previousIssues.map((issue) =>
          issue._id === issueId
            ? {
                ...issue,
                status: oldStatus,
              }
            : issue
        )
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
        return;
      }

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to move issue"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
// AI RESOLUTION ASSISTANCE
// =====================================================

const analyzeResolution = async (issueId) => {
  if (!token) {
    alert("Please login again.");
    navigate("/login");
    return;
  }

  try {
    setResolutionLoadingId(issueId);

    const res = await axios.post(
      `http://localhost:5000/api/ai/analyze-resolution/${issueId}`,
      {},
      getAuthConfig()
    );

    const analysis = res.data?.analysis;

    if (!analysis) {
      throw new Error(
        "AI did not return resolution analysis"
      );
    }

    // Update issue inside the page immediately
    setIssues((previousIssues) =>
      previousIssues.map((issue) =>
        issue._id === issueId
          ? {
              ...issue,
              aiAnalysis: analysis,
            }
          : issue
      )
    );

    // Update the currently opened modal
    setSelectedResolutionIssue((previous) =>
      previous && previous._id === issueId
        ? {
            ...previous,
            aiAnalysis: analysis,
          }
        : previous
    );

  } catch (error) {
    console.error(
      "AI resolution analysis error:",
      error
    );

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login", {
        replace: true,
      });

      return;
    }

    alert(
      error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to generate AI resolution assistance"
    );

  } finally {
    setResolutionLoadingId(null);
  }
};
const handleInvestigateIssue = async (issue) => {
  try {
    setInvestigationIssue(issue);
    setInvestigationResult(null);
    setInvestigationLoading(true);
    setShowInvestigationModal(true);

    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/ai/investigate/${issue._id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        data.error ||
        "Failed to investigate issue"
      );
    }

    setInvestigationResult(data);
  } catch (error) {
    console.error(
      "AI Investigation Error:",
      error
    );

    alert(
      error.message ||
      "Failed to investigate issue"
    );

    setShowInvestigationModal(false);
  } finally {
    setInvestigationLoading(false);
  }
};

  // =====================================================
// DELETE ISSUE
// =====================================================

const deleteIssue = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this issue?"
  );

  if (!confirmed) {
    return;
  }

  try {
    setUpdatingId(id);

    const response = await axios.delete(
      `http://localhost:5000/api/issues/${id}`,
      getAuthConfig()
    );

    console.log(
      "DELETE RESPONSE:",
      response.data
    );

    // Remove deleted issue from the UI
    setIssues((previousIssues) =>
      previousIssues.filter(
        (issue) => issue._id !== id
      )
    );

  } catch (error) {
    console.error(
      "Delete issue error:",
      error
    );

    console.error(
      "Status:",
      error.response?.status
    );

    console.error(
      "Response:",
      error.response?.data
    );

    alert(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to delete issue"
    );

  } finally {
    setUpdatingId(null);
  }
};
// =====================================================
// ATTACHMENTS
// =====================================================

const fetchAttachments = async (issueId) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/attachments/${issueId}`,
      getAuthConfig()
    );

    const attachmentData = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.attachments)
      ? res.data.attachments
      : [];

    setAttachments((prev) => ({
      ...prev,
      [issueId]: attachmentData,
    }));
  } catch (error) {
    console.error(
      "Fetch attachments error:",
      error.response?.data || error.message
    );

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
      return;
    }

    setAttachments((prev) => ({
      ...prev,
      [issueId]: [],
    }));

    alert(
      error.response?.data?.message ||
      "Failed to load attachments"
    );
  }
};

const toggleAttachments = async (issueId) => {
  if (expandedAttachments === issueId) {
    setExpandedAttachments(null);
    return;
  }

  setExpandedAttachments(issueId);
  await fetchAttachments(issueId);
};

const handleFileSelect = (issueId, file) => {
  setSelectedFiles((prev) => ({
    ...prev,
    [issueId]: file,
  }));
};

const uploadAttachment = async (issueId) => {
  const file = selectedFiles[issueId];

  if (!file) {
    alert("Please select a file first.");
    return;
  }

  try {
    setUploadingFile(issueId);

    const formData = new FormData();
    formData.append("file", file);

    await axios.post(
      `http://localhost:5000/api/attachments/${issueId}`,
      formData,
      getAuthConfig()
    );

    setSelectedFiles((prev) => ({
      ...prev,
      [issueId]: null,
    }));

    await fetchAttachments(issueId);
  } catch (error) {
    console.error(
      "Upload attachment error:",
      error.response?.data || error.message
    );

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
      return;
    }

    alert(
      error.response?.data?.message ||
      "Failed to upload attachment"
    );
  } finally {
    setUploadingFile(null);
  }
};

const deleteAttachment = async (issueId, attachmentId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this attachment?"
  );

  if (!confirmed) return;

  try {
    await axios.delete(
      `http://localhost:5000/api/attachments/file/${attachmentId}`,
      getAuthConfig()
    );

    setAttachments((prev) => ({
      ...prev,
      [issueId]: (prev[issueId] || []).filter(
        (attachment) => attachment._id !== attachmentId
      ),
    }));
  } catch (error) {
    console.error(
      "Delete attachment error:",
      error.response?.data || error.message
    );

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
      return;
    }

    alert(
      error.response?.data?.message ||
      "Failed to delete attachment"
    );
  }
};
 

  // =====================================================
  // FILTER ISSUES
  // =====================================================

  const filteredIssues = issues.filter((issue) => {
    const query = search.toLowerCase().trim();

    const matchesSearch =
      !query ||
      issue.title?.toLowerCase().includes(query) ||
      issue.description?.toLowerCase().includes(query) ||
      issue.category?.toLowerCase().includes(query) ||
      issue.project?.projectName
        ?.toLowerCase()
        .includes(query);

    const matchesPriority =
      priorityFilter === "All" ||
      (issue.priority || "Medium") === priorityFilter;


        return matchesSearch && matchesPriority;
  });

  // =====================================================
  // KANBAN COLUMNS
  // =====================================================

  const openIssues = filteredIssues.filter(
    (issue) =>
      (issue.status || "Open") === "Open"
  );

  const inProgressIssues = filteredIssues.filter(
    (issue) => issue.status === "In Progress"
  );

  const inReviewIssues = filteredIssues.filter(
    (issue) => issue.status === "In Review"
  );

  const resolvedIssues = filteredIssues.filter(
    (issue) => issue.status === "Resolved"
  );

  // =====================================================
  // STATISTICS
  // =====================================================

  console.log("CURRENT ISSUES:", issues);
console.log("TOTAL ISSUES:", issues.length);

  const totalIssues = issues.length;

  const totalOpen = issues.filter(
    (issue) =>
      (issue.status || "Open") === "Open"
  ).length;

  const totalInProgress = issues.filter(
    (issue) => issue.status === "In Progress"
  ).length;

  const totalInReview = issues.filter(
    (issue) => issue.status === "In Review"
  ).length;

  const totalResolved = issues.filter(
    (issue) => issue.status === "Resolved"
  ).length;

  // =====================================================
  // PRIORITY COLORS
  // =====================================================

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "Low":
        return {
          background: "#e8f3eb",
          color: "#356746",
        };

      case "High":
        return {
          background: "#f8e7d7",
          color: "#9a4f1f",
        };

      case "Critical":
        return {
          background: "#f8dfe3",
          color: "#9f2944",
        };

      default:
        return {
          background: "#f6edcf",
          color: "#7c641f",
        };
    }
  };

  // =====================================================
  // SEVERITY COLORS
  // =====================================================

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case "Low":
        return {
          background: "#edf4ef",
          color: "#47705a",
        };

      case "High":
        return {
          background: "#f6dfd8",
          color: "#9a4938",
        };

      case "Critical":
        return {
          background: "#f3d5dc",
          color: "#8f3048",
        };

      default:
        return {
          background: "#eee7df",
          color: "#6e5b50",
        };
    }
  };

  // =====================================================
  // REUSABLE SELECT
  // =====================================================

  const FieldSelect = ({
    label,
    value,
    onChange,
    options,
    disabled,
  }) => (
    <div>
      <label style={fieldLabelStyle}>
        {label}
      </label>

      <select
        value={value}
        disabled={disabled}
        onChange={(e) =>
          onChange(e.target.value)
        }
        style={{
          ...selectStyle,
          cursor: disabled
            ? "wait"
            : "pointer",
        }}
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
  

  // =====================================================
  // DRAGGABLE ISSUE CARD//
  // =====================================================

  const IssueCard = ({ issue }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      isDragging,
    } = useDraggable({
      id: issue._id,
      disabled: updatingId === issue._id,
    });

    const priority =
      issue.priority || "Medium";

    const severity =
      issue.severity || "Medium";

    const category =
      issue.category || "Other";

    const status =
      issue.status || "Open";

    const isUpdating =
      updatingId === issue._id;

    const transformStyle = transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined;

      const statusFlow = {
  Open: ["Open", "In Progress"],
  "In Progress": ["In Progress", "In Review"],
  "In Review": ["In Review", "Resolved"],
  Resolved: ["Resolved"],
};

const availableStatusOptions =
  statusFlow[status] || ["Open"];
    return (

      
      <div
        ref={setNodeRef}
        style={{
          background: "#fffaf8",
          border: isDragging
            ? "2px solid #91465d"
            : "1px solid #eadbd6",
          borderRadius: "16px",
          padding: "18px",
          marginBottom: "16px",
          boxShadow: isDragging
            ? "0 18px 35px rgba(112,47,67,0.20)"
            : "0 5px 18px rgba(75,45,52,0.07)",
          transform: transformStyle,
          opacity: isDragging ? 0.8 : 1,
          position: "relative",
          zIndex: isDragging ? 1000 : 1,
          transition: isDragging
            ? "none"
            : "box-shadow 0.2s ease, border 0.2s ease",
        }}
      >
        {/* DRAG HANDLE */}

        {/* TOP BAR */}

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  }}
>
  {/* DRAG HANDLE */}

  <div
    {...listeners}
    {...attributes}
    style={{
      cursor: isUpdating ? "wait" : "grab",
      color: "#a8868e",
      fontSize: "18px",
      lineHeight: 1,
      userSelect: "none",
      padding: "3px 6px",
    }}
  >
    ⋮⋮
  </div>

  {/* THREE DOT MENU */}

  <button
    type="button"
    onClick={() =>
      setOpenIssueMenu(
        openIssueMenu === issue._id
          ? null
          : issue._id
      )
    }
    style={{
      border: "none",
      background: "transparent",
      color: "#702f43",
      fontSize: "22px",
      fontWeight: "700",
      cursor: "pointer",
      padding: "2px 6px",
      lineHeight: 1,
    }}
    title="More actions"
  >
    ⋮
  </button>
  {openIssueMenu === issue._id && (
  <div
    style={{
      position: "absolute",
      top: "48px",
      right: "12px",
      width: "190px",
      background: "#fffaf8",
      border: "1px solid #eadbd6",
      borderRadius: "12px",
      boxShadow: "0 10px 25px rgba(75,45,52,0.15)",
      padding: "6px",
      zIndex: 2000,
    }}
  >

    {/* EDIT DETAILS */}

    <button
      type="button"
      onClick={() => {
        setExpandedIssueDetails(
          expandedIssueDetails === issue._id
            ? null
            : issue._id
        );
        setOpenIssueMenu(null);
      }}
      style={{
        width: "100%",
        border: "none",
        background: "transparent",
        padding: "9px 10px",
        textAlign: "left",
        borderRadius: "8px",
        color: "#702f43",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "600",
      }}
    >
      ✏️ Edit Details
    </button>
      {/* AI REPORT BUTTON */}

{issue.report && (
  <button
    type="button"
    onClick={() => setSelectedReport(issue)}
    style={{
      width: "100%",
      minWidth: 0,
      padding: "7px 6px",
      border: "none",
      textAlign: "left",
      borderRadius: "8px",
      background: "#f4e2e5",
      color: "#702f43",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "12px",
    }}
  >
  ✨ View AI Report
  </button>
)}
     

    {/* COMMENTS */}

    <button
      type="button"
      onClick={() => {
        setCommentModalIssue(issue);
        setOpenIssueMenu(null);
      }}
      style={{
        width: "100%",
        border: "none",
        background: "transparent",
        padding: "9px 10px",
        textAlign: "left",
        borderRadius: "8px",
        color: "#702f43",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "600",
      }}
    >
      💬 Comments
    </button>

    {/* ATTACHMENTS */}

    <button
      type="button"
      onClick={async () => {
        setAttachmentModalIssue(issue);
        await fetchAttachments(issue._id);
        setOpenIssueMenu(null);
      }}
      style={{
        width: "100%",
        border: "none",
        background: "transparent",
        padding: "9px 10px",
        textAlign: "left",
        borderRadius: "8px",
        color: "#702f43",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "600",
      }}
    >
      📎 Attachments
    </button>

    <div
      style={{
        height: "1px",
        background: "#eadbd6",
        margin: "5px 4px",
      }}
    />

    {/* DELETE */}

    <button
      type="button"
      disabled={isUpdating}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenIssueMenu(null);
        deleteIssue(issue._id);
      }}
      style={{
        width: "100%",
        border: "none",
        background: "transparent",
        padding: "9px 10px",
        textAlign: "left",
        borderRadius: "8px",
        color: "#b4233f",
        cursor: isUpdating ? "wait" : "pointer",
        fontSize: "13px",
        fontWeight: "600",
      }}
    >
      🗑 Delete
    </button>

  </div>
)}
</div>

      
        {/* TITLE */}

        <h3
          style={{
            margin: "0 0 10px",
            color: "#352b2d",
            fontSize: "17px",
          }}
        >
          {issue.title ||
            issue.description?.substring(
              0,
              45
            ) ||
            "Untitled Issue"}
        </h3>

        {/* DESCRIPTION */}

       <p
  style={{
    color: "#75676a",
    lineHeight: "1.5",
    fontSize: "13px",
    margin: "0 0 12px",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  }}
>
          {issue.description?.length > 80
            ? `${issue.description.substring(0,80)}...`
            : issue.description}
        </p>

        {/* BADGES */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            flexWrap: "wrap",
            marginBottom: "13px",
          }}
        >
          <span
            style={{
              ...getPriorityStyle(priority),
              ...badgeStyle,
            }}
          >
            {priority} Priority
          </span>

          <span
            style={{
              ...getSeverityStyle(severity),
              ...badgeStyle,
            }}
          >
            {severity} Severity
          </span>

          <span
            style={{
              background: "#f1e5e3",
              color: "#702f43",
              ...badgeStyle,
            }}
          >
            {category}
          </span>
        </div>

        {/* DATE */}

        <div
          style={{
            color: "#a08f92",
            fontSize: "12px",
            marginBottom: "13px",
          }}
        >
          {issue.createdAt
            ? new Date(
                issue.createdAt
              ).toLocaleDateString()
            : ""}
        </div>

        {issue.sprint && (
  <div
    style={{
      background: "#f4e2e5",
      borderRadius: "8px",
      padding: "8px 10px",
      marginBottom: "10px",
      color: "#702f43",
      fontSize: "13px",
      fontWeight: "600",
    }}
  >
     Sprint: {issue.sprint.name}
  </div>
)}

        {/* PROJECT */}

        {issue.project?.projectName && (
          <div
            style={{
              background: "#f8eeeb",
              borderRadius: "8px",
              padding: "9px 10px",
              color: "#705d61",
              fontSize: "13px",
              marginBottom: "15px",
            }}
          >
            <strong>Project:</strong>{" "}
            {issue.project.projectName}
          </div>
        )}

        {/* ASSIGNED DEVELOPER DISPLAY */}

{issue.assignedDeveloper && (
  <div
    style={{
      background: "#f4e2e5",
      borderRadius: "8px",
      padding: "9px 10px",
      marginBottom: "15px",
      color: "#702f43",
      fontSize: "13px",
    }}
  >
    <div
      style={{
        fontSize: "10px",
        fontWeight: "700",
        textTransform: "uppercase",
        color: "#9a7180",
        marginBottom: "4px",
      }}
    >
      Assigned Developer
    </div>

    <div
      style={{
        fontWeight: "700",
        fontSize: "14px",
      }}
    >
      👤 {issue.assignedDeveloper.name}
    </div>

    <div
      style={{
        fontSize: "11px",
        marginTop: "3px",
        color: "#80636d",
      }}
    >
      {issue.assignedDeveloper.role}
    </div>
  </div>
)}

        {expandedIssueDetails === issue._id && (

          
  <>
  {/* ASSIGNED DEVELOPER */}

{issue.assignedDeveloper && (
  <div
    style={{
      background: "#f4e2e5",
      borderRadius: "8px",
      padding: "9px 10px",
      marginBottom: "15px",
      color: "#702f43",
      fontSize: "13px",
    }}
  >
    <div
      style={{
        fontSize: "10px",
        fontWeight: "700",
        textTransform: "uppercase",
        color: "#9a7180",
        marginBottom: "4px",
      }}
    >
      Assigned Developer
    </div>

    <div
      style={{
        fontWeight: "700",
        fontSize: "14px",
      }}
    >
      👤 {issue.assignedDeveloper.name}
    </div>

    <div
      style={{
        fontSize: "11px",
        marginTop: "3px",
        color: "#80636d",
      }}
    >
      {issue.assignedDeveloper.role}
    </div>
  </div>
)}

{issue.project?.projectName && (
  <div
    style={{
      background: "#f8eeeb",
      borderRadius: "8px",
      padding: "9px 10px",
      color: "#705d61",
      fontSize: "13px",
      marginBottom: "15px",
    }}
  >
    <strong>Project:</strong>{" "}
    {issue.project.projectName}
  </div>
)}

    <div style={{ marginBottom: "15px" }}>
      <label style={fieldLabelStyle}>
        SPRINT
  </label>

  <select
    value={issue.sprint?._id || ""}
    disabled={isUpdating}
    onChange={(e) =>
      updateIssueField(
        issue._id,
        "sprint",
        e.target.value || null
      )
    }
    style={selectStyle}
  >
    <option value="">No Sprint</option>

    {sprints.map((sprint) => (
      <option
        key={sprint._id}
        value={sprint._id}
      >
        {sprint.name}
      </option>
    ))}
  </select>
</div>

        {/* STATUS */}

        <FieldSelect
          label="STATUS"
          value={status}
          disabled={isUpdating}
          options={availableStatusOptions}
          onChange={(value) =>
            updateIssueField(
              issue._id,
              "status",
              value
            )
          }
        />

        {/* PRIORITY + SEVERITY */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "10px",
          }}
        >
          <FieldSelect
            label="PRIORITY"
            value={priority}
            disabled={isUpdating}
            options={[
              "Low",
              "Medium",
              "High",
              "Critical",
            ]}
            onChange={(value) =>
              updateIssueField(
                issue._id,
                "priority",
                value
              )
            }
          />

          <FieldSelect
            label="SEVERITY"
            value={severity}
            disabled={isUpdating}
            options={[
              "Low",
              "Medium",
              "High",
              "Critical",
            ]}
            onChange={(value) =>
              updateIssueField(
                issue._id,
                "severity",
                value
              )
            }
          />
        </div>

        {/* CATEGORY */}

        <FieldSelect
          label="CATEGORY"
          value={category}
          disabled={isUpdating}
          options={[
            "UI",
            "Authentication",
            "Backend",
            "Database",
            "API",
            "Performance",
            "Security",
            "Navigation",
            "Checkout",
            "Other",
          ]}
          onChange={(value) =>
            updateIssueField(
              issue._id,
              "category",
              value
            )
          }
        />
          </>
)}
        
        {/* ACTION BUTTONS */}

<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    marginTop: "4px",
    width: "100%",
  }}
>


<button
  onClick={() => generateTestCases(issue._id)}
  disabled={generatingTestCases}
  style={{
    width: "100%",
    padding: "8px",
    marginTop: "6px",
    border: "none",
    borderRadius: "7px",
    background: "#7a2948",
    color: "white",
    fontWeight: "600",
    cursor: generatingTestCases
      ? "not-allowed"
      : "pointer",
  }}
>
   {generatingTestCases
    ? "Generating Test Cases..."
    : "Generate Test Cases"}
</button>
      

      {/* AI RESOLUTION ASSISTANCE BUTTON */}

<button
  type="button"
  onClick={() => {
    setSelectedResolutionIssue(issue);
    // If analysis already exists,
    // show it immediately.
    // Otherwise generate a new one.
    if (!issue.aiAnalysis?.probableRootCause) {
      analyzeResolution(issue._id);
    }
  }}
  style={{
    width: "100%",
    padding: "8px 6px",
    border: "none",
    borderRadius: "7px",
    background: "#702f43",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "600",
  }}
>
   AI Resolution
</button>
<button
  type="button"
  onClick={() => handleInvestigateIssue(issue)}
  disabled={
    investigationLoading &&
    investigationIssue?._id === issue._id
  }
  style={{
    ...compactActionButtonStyle,
    background: "#eee3df",
    color: "#702f43",
  }}
>
  {investigationLoading &&
  investigationIssue?._id === issue._id
    ? "Investigating..."
    : "🔍 AI Investigation"}
</button>
 

  {/* ======================================
    ATTACHMENTS PANEL
====================================== */}

{expandedAttachments === issue._id && (
  <div
    style={{
      gridColumn: "1 / -1",
      width: "100%",
      boxSizing: "border-box",
      marginTop: "4px",
      padding: "14px",
      border: "1px solid #eadbd6",
      borderRadius: "10px",
      background: "#fffaf8",
    }}
  >
    <h4
      style={{
        margin: "0 0 12px",
        color: "#702f43",
      }}
    >
      Attachments
    </h4>

    {/* EXISTING ATTACHMENTS */}

    {attachments[issue._id]?.length > 0 ? (
      attachments[issue._id].map(
        (attachment) => (
          <div
            key={attachment._id}
            style={{
              padding: "9px",
              marginBottom: "8px",
              border: "1px solid #eadbd6",
              borderRadius: "8px",
              background: "#ffffff",
            }}
          >
           <button
  type="button"
  onClick={() => setPreviewAttachment(attachment)}
  style={{
    display: "block",
    width: "100%",
    marginBottom: "6px",
    padding: 0,
    border: "none",
    background: "transparent",
    color: "#702f43",
    fontWeight: "600",
    fontSize: "13px",
    wordBreak: "break-word",
    textAlign: "left",
    cursor: "pointer",
  }}
>
  📎{" "}
  {attachment.originalName ||
    attachment.filename ||
    "Attachment"}
</button>
            <button
              type="button"
              onClick={() =>
                deleteAttachment(
                  issue._id,
                  attachment._id
                )
              }
              style={{
                padding: 0,
                border: "none",
                background: "transparent",
                color: "#b4233f",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              Delete
            </button>
          </div>
        )
      )
    ) : (
      <p
        style={{
          fontSize: "13px",
          color: "#8b777d",
        }}
      >
        No attachments yet.
      </p>
    )}

    {/* FILE INPUT */}

    <input
      type="file"
      accept=".png,.jpg,.jpeg,.webp,.pdf,.txt"
      onChange={(e) => {
        const file = e.target.files?.[0] || null;
        console.log("Selected file:", file);
        handleFileSelect(issue._id, file);
      }}
      style={{
        width: "100%",
        marginTop: "8px",
        fontSize: "12px",
        cursor: "pointer",
      }}
    />

    {selectedFiles[issue._id] && (
      <div
        style={{
          marginTop: "8px",
          padding: "8px 10px",
          background: "#f7edef",
          borderRadius: "7px",
          color: "#702f43",
          fontSize: "12px",
          wordBreak: "break-word",
        }}
      >
        📎 Selected: <strong>{selectedFiles[issue._id].name}</strong>
      </div>
    )}

    {/* UPLOAD */}

    <button
      type="button"
      disabled={
        uploadingFile === issue._id ||
        !selectedFiles[issue._id]
      }
      onClick={() =>
        uploadAttachment(issue._id)
      }
      style={{
        width: "100%",
        marginTop: "10px",
        padding: "9px",
        border: "none",
        borderRadius: "8px",
        background:
          uploadingFile === issue._id ||
          !selectedFiles[issue._id]
            ? "#d8c5ca"
            : "#8f3d59",
        color: "#ffffff",
        cursor:
          uploadingFile === issue._id ||
          !selectedFiles[issue._id]
            ? "not-allowed"
            : "pointer",
        fontWeight: "600",
      }}
    >
      {uploadingFile === issue._id
        ? "Uploading..."
        : "Upload Attachment"}
    </button>
  </div>
)}
</div>
        
          {/* COMMENTS */}

{expandedComments === issue._id && (
  <div
    style={{
      marginTop: "15px",
      padding: "15px",
      background: "#fdf5f3",
      borderRadius: "10px",
      border: "1px solid #eadbd6",
    }}
  >
    <h4
      style={{
        margin: "0 0 15px",
        color: "#702f43",
      }}
    >
      Comments
    </h4>

    {/* LOADING */}

    {commentsLoading === issue._id ? (
      <p
        style={{
          color: "#75676a",
          fontSize: "13px",
        }}
      >
        Loading comments...
      </p>
    ) : (
      <>
        {/* COMMENT LIST */}

        {(comments[issue._id] || [])
          .length === 0 ? (
          <p
            style={{
              color: "#a08f92",
              fontSize: "13px",
            }}
          >
            No comments yet.
          </p>
        ) : (
          (comments[issue._id] || []).map(
            (comment) => (
              <div
                key={comment._id}
                style={{
                  background: "#fffaf8",
                  border:
                    "1px solid #eadbd6",
                  padding: "11px",
                  borderRadius: "9px",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    gap: "10px",
                    marginBottom: "6px",
                  }}
                >
                  <strong
                    style={{
                      color: "#4b3b3f",
                      fontSize: "13px",
                    }}
                  >
                    {comment.user?.name ||
                      "User"}
                  </strong>

                  <span
                    style={{
                      color: "#a08f92",
                      fontSize: "11px",
                    }}
                  >
                    {comment.createdAt
                      ? new Date(
                          comment.createdAt
                        ).toLocaleString()
                      : ""}
                  </span>
                </div>

                <p
                  style={{
                    margin: "0 0 8px",
                    color: "#705d61",
                    fontSize: "13px",
                    lineHeight: "1.5",
                  }}
                >
                  {comment.text}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    deleteComment(
                      issue._id,
                      comment._id
                    )
                  }
                  style={{
                    border: "none",
                    background:
                      "transparent",
                    color: "#9f2944",
                    padding: 0,
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  Delete
                </button>
              </div>
            )
          )
        )}

        {/* ADD COMMENT */}

        <textarea
          placeholder="Write a comment..."
          value={
            commentText[issue._id] || ""
          }
          onChange={(e) =>
            setCommentText(
              (previous) => ({
                ...previous,
                [issue._id]:
                  e.target.value,
              })
            )
          }
          rows="3"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "10px",
            borderRadius: "8px",
            border:
              "1px solid #d8c7c3",
            resize: "vertical",
            fontFamily: "inherit",
            fontSize: "13px",
            outline: "none",
            marginTop: "5px",
          }}
        />

        <button
          type="button"
          disabled={
            commentSubmitting ===
            issue._id
          }
          onClick={() =>
            addComment(issue._id)
          }
          style={{
            width: "100%",
            marginTop: "8px",
            padding: "10px",
            border: "none",
            borderRadius: "8px",
            background:
              "linear-gradient(135deg, #702f43, #91465d)",
            color: "#ffffff",
            fontWeight: "700",
            cursor:
              commentSubmitting ===
              issue._id
                ? "wait"
                : "pointer",
          }}
        >
          {commentSubmitting ===
          issue._id
            ? "Adding..."
            : "Add Comment"}
        </button>
      </>
      
    )}
  </div>
)}
<button
  type="button"
  className="recommend-developer-btn"
  onClick={() => handleRecommendDeveloper(issue)}
  disabled={loadingRecommendation}
  style={{
    ...compactActionButtonStyle,
    background: "#f4e2e5",
    color: "#702f43",
    cursor: loadingRecommendation
      ? "wait"
      : "pointer",
  }}
>
  {loadingRecommendation
  ? "Finding Best Developer..."
  : issue.assignedDeveloper
    ? "Reassign Developer"
    : "Recommend Developer"}
</button>

<button
  type="button"
  className="verify-resolution-btn"
  onClick={() => {
    setSelectedVerificationIssue(issue);
    setVerificationResult(null);
    setDeveloperFix("");
    setShowVerificationModal(true);
  }}
  style={{
    ...compactActionButtonStyle,
    background: "#eee3df",
    color: "#702f43",
  }}
>
  Verify Resolution
</button>
      </div>
    );
  };
  

  // =====================================================
  // DROPPABLE KANBAN COLUMN
  // =====================================================

  const KanbanColumn = ({
    title,
    columnIssues,
    accent,
    background,
  }) => {
    const {
      setNodeRef,
      isOver,
    } = useDroppable({
      id: title,
    });

    return (
      <div
        ref={setNodeRef}
        style={{
          background,
          borderRadius: "18px",
          padding: "16px",
          minHeight: "400px",

          border: isOver
            ? `2px solid ${accent}`
            : "1px solid #eadbd6",

          boxShadow: isOver
            ? "0 10px 30px rgba(112,47,67,0.15)"
            : "none",

          transform: isOver
            ? "translateY(-3px)"
            : "translateY(0)",

          transition:
            "border 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
        }}
      >
        {/* COLUMN HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: accent,
              }}
            />

            <h2
              style={{
                margin: 0,
                fontSize: "16px",
                color: "#352b2d",
              }}
            >
              {title}
            </h2>
          </div>

          <span
            style={{
              background: "#fffaf8",
              color: "#705d61",
              minWidth: "30px",
              height: "30px",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
              fontWeight: "700",
              fontSize: "13px",
            }}
          >
            {columnIssues.length}
          </span>
        </div>

        {/* DROP MESSAGE */}

        {isOver && (
          <div
            style={{
              padding: "10px",
              marginBottom: "12px",
              borderRadius: "9px",
              background:
                "rgba(255,255,255,0.65)",
              textAlign: "center",
              color: accent,
              fontSize: "12px",
              fontWeight: "700",
            }}
          >
            Drop issue here
          </div>
        )}

        {/* ISSUES */}

        {columnIssues.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "45px 10px",
              color: "#ad999d",
            }}
          >
            <div
              style={{
                fontSize: "30px",
                marginBottom: "10px",
              }}
            >
              ◇
            </div>

            <p style={{ margin: 0 }}>
              {isOver
                ? "Release to move issue"
                : "No issues here"}
            </p>
          </div>
        ) : (
          columnIssues.map((issue) => (
            <IssueCard
              key={issue._id}
              issue={issue}
            />
          ))
        )}
      </div>
    );
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fbf5f2 0%, #f5e8e5 100%)",
        padding: "35px",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#30282b",
              fontSize: "32px",
            }}
          >
            Issues
          </h1>

          <p
            style={{
              color: "#75676a",
              marginTop: "7px",
            }}
          >
            Track, prioritize and manage
            your bug lifecycle.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/create-issue")
          }
          style={primaryButtonStyle}
        >
          + Create Issue
        </button>
      </div>

      {/* STATISTICS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        {[
          {
            title: "Total Issues",
            value: totalIssues,
            symbol: "◈",
            background: "#fffaf8",
            color: "#4b3b3f",
          },
          {
            title: "Open",
            value: totalOpen,
            symbol: "●",
            background: "#f9ebe7",
            color: "#a45646",
          },
          {
            title: "In Progress",
            value: totalInProgress,
            symbol: "◐",
            background: "#f8efd9",
            color: "#8b6c27",
          },
          {
            title: "In Review",
            value: totalInReview,
            symbol: "◎",
            background: "#f2e3e7",
            color: "#91465d",
          },
          {
            title: "Resolved",
            value: totalResolved,
            symbol: "✓",
            background: "#e9f1e9",
            color: "#4c7155",
          },
        ].map((card) => (
          <div
            key={card.title}
            style={{
              background:
                card.background,
              padding: "20px",
              borderRadius: "15px",
              border:
                "1px solid #eadbd6",
              boxShadow:
                "0 4px 14px rgba(75,45,52,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
              }}
            >
              <span
                style={{
                  color: "#75676a",
                  fontWeight: "600",
                }}
              >
                {card.title}
              </span>

              <span
                style={{
                  color: card.color,
                  fontSize: "20px",
                }}
              >
                {card.symbol}
              </span>
            </div>

            <h2
              style={{
                color: card.color,
                fontSize: "30px",
                marginBottom: 0,
              }}
            >
              {card.value}
            </h2>
          </div>
        ))}
      </div>

      {/* SEARCH */}

      <div
        style={{
          background: "#fffaf8",
          padding: "15px",
          borderRadius: "14px",
          display: "flex",
          gap: "12px",
          marginBottom: "25px",
          border:
            "1px solid #eadbd6",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search title, description, category or project..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            flex: 1,
            minWidth: "230px",
            padding: "12px 15px",
            borderRadius: "9px",
            border:
              "1px solid #d8c7c3",
            outline: "none",
            fontSize: "14px",
            background: "#ffffff",
          }}
        />

        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(
              e.target.value
            )
          }
          style={{
            padding: "12px 15px",
            borderRadius: "9px",
            border:
              "1px solid #d8c7c3",
            background: "#ffffff",
          }}
        >
          <option value="All">
            All Priorities
          </option>

          <option value="Low">
            Low
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="High">
            High
          </option>

          <option value="Critical">
            Critical
          </option>
        </select>
      </div>

      {/* CONTENT */}

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            color: "#75676a",
          }}
        >
          <h3>
            Loading your issues...
          </h3>
        </div>
      ) : issues.length === 0 ? (
        <div
          style={{
            background: "#fffaf8",
            borderRadius: "20px",
            padding: "70px 20px",
            textAlign: "center",
            border:
              "1px solid #eadbd6",
          }}
        >
          <div
            style={{
              width: "70px",
              height: "70px",
              margin:
                "0 auto 20px",
              borderRadius: "20px",
              background: "#f4e2e5",
              color: "#702f43",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
              fontSize: "30px",
            }}
          >
            ◇
          </div>

          <h2
            style={{
              color: "#4b3b3f",
            }}
          >
            No issues yet
          </h2>

          <p
            style={{
              color: "#75676a",
              maxWidth: "450px",
              margin:
                "0 auto 25px",
              lineHeight: "1.6",
            }}
          >
            Your workspace is clean.
            Create your first issue to
            start tracking the bug
            lifecycle.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/create-issue"
              )
            }
            style={
              primaryButtonStyle
            }
          >
            + Create Your First Issue
          </button>
        </div>
      ) : (
        // ===============================================
        // DND CONTEXT
        // ===============================================

        <DndContext
          onDragEnd={handleDragEnd}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:"repeat(4, minmax(0, 1fr))",
              gap: "14px",
              alignItems: "start",
              overflowX: "auto",
              paddingBottom: "10px",
            }}
          >
            <KanbanColumn
              title="Open"
              columnIssues={
                openIssues
              }
              accent="#b76858"
              background="#f9ebe7"
            />

            <KanbanColumn
              title="In Progress"
              columnIssues={
                inProgressIssues
              }
              accent="#b38a35"
              background="#f8efd9"
            />

            <KanbanColumn
              title="In Review"
              columnIssues={
                inReviewIssues
              }
              accent="#91465d"
              background="#f2e3e7"
            />

            <KanbanColumn
              title="Resolved"
              columnIssues={
                resolvedIssues
              }
              accent="#55765d"
              background="#e9f1e9"
            />
          </div>
        </DndContext>
      )}
        {/* ==========================================
          ATTACHMENT PREVIEW MODAL
      ========================================== */}

      {previewAttachment && (
        <div
          onClick={() => setPreviewAttachment(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(40, 25, 30, 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(900px, 95vw)",
              height: "min(700px, 88vh)",
              background: "#fffaf8",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow:
                "0 25px 70px rgba(0,0,0,0.30)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* HEADER */}

            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #eadbd6",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    color: "#702f43",
                    fontSize: "18px",
                  }}
                >
                  Attachment Preview
                </h3>

                <p
                  style={{
                    margin: "5px 0 0",
                    color: "#75676a",
                    fontSize: "13px",
                  }}
                >
                  {previewAttachment.originalName ||
                    previewAttachment.filename ||
                    "Attachment"}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPreviewAttachment(null)
                }
                style={{
                  border: "none",
                  background: "#f4e2e5",
                  color: "#702f43",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: "700",
                }}
              >
                ×
              </button>
            </div>

            {/* FILE PREVIEW */}

            <div
              style={{
                flex: 1,
                padding: "15px",
                background: "#f8f3f1",
              }}
            >
              <iframe
                src={`http://localhost:5000${
                  previewAttachment.filePath ||
                  previewAttachment.url ||
                  ""
                }`}
                title="Attachment Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  borderRadius: "10px",
                  background: "#ffffff",
                }}
              />
            </div>
          </div>
        </div>
      )}
      <CommentsModal
  open={commentModalIssue !== null}
  onClose={() => setCommentModalIssue(null)}
  issue={commentModalIssue}
  comments={comments}
  commentsLoading={commentsLoading === commentModalIssue?._id}
  commentText={commentText}
  setCommentText={setCommentText}
  addComment={addComment}
  deleteComment={deleteComment}
  commentSubmitting={commentSubmitting}
/>
<AttachmentModal
  open={attachmentModalIssue !== null}
  onClose={() => setAttachmentModalIssue(null)}
  issue={attachmentModalIssue}
  attachments={
    attachmentModalIssue
      ? attachments[attachmentModalIssue._id] || []
      : []
  }
  selectedFile={
    attachmentModalIssue
      ? selectedFiles[attachmentModalIssue._id]
      : null
  }
  onFileSelect={(file) =>
    handleFileSelect(attachmentModalIssue._id, file)
  }
  onUpload={() =>
    uploadAttachment(attachmentModalIssue._id)
  }
  onDelete={deleteAttachment}
  uploading={
    uploadingFile === attachmentModalIssue?._id
  }
  onPreview={(attachment) =>
    setPreviewAttachment(attachment)
  }
/>
<AIReportModal
  issue={selectedReport}
  onClose={() => setSelectedReport(null)}
/>
<ResolutionAssistantModal
  issue={selectedResolutionIssue}
  analysis={
    selectedResolutionIssue?.aiAnalysis
  }
  loading={
    selectedResolutionIssue &&
    resolutionLoadingId ===
      selectedResolutionIssue._id
  }
  onClose={() =>
    setSelectedResolutionIssue(null)
  }
  onRegenerate={() => {
    if (selectedResolutionIssue) {
      analyzeResolution(
        selectedResolutionIssue._id
      );
    }
  }}
/>

<AIInvestigationModal
  open={showInvestigationModal}
  issue={investigationIssue}
  result={investigationResult}
  loading={investigationLoading}
  onClose={() => {
    setShowInvestigationModal(false);
    setInvestigationIssue(null);
    setInvestigationResult(null);
  }}
/>
<TestCasesModal
  open={showTestCasesModal}
  onClose={() => setShowTestCasesModal(false)}
  testCases={testCases}
/>
<DeveloperRecommendationModal
  open={showDeveloperModal}
  recommendation={recommendedDeveloper}
  issue={recommendedIssue}
  onClose={() => setShowDeveloperModal(false)}
  onAssign={handleAssignDeveloper}
/>
<ResolutionVerificationModal
  open={showVerificationModal}
  issue={selectedVerificationIssue}
  onClose={() => {
    setShowVerificationModal(false);
    setVerificationResult(null);
    setDeveloperFix("");
  }}
  onVerify={() =>
    handleVerifyResolution(selectedVerificationIssue)
  }
  loading={verificationLoading}
  verification={verificationResult}
  developerFix={developerFix}
  setDeveloperFix={setDeveloperFix}
/>

    </div>
  );
}

// =====================================================
// REUSABLE STYLES
// =====================================================

const fieldLabelStyle = {
  display: "block",
  color: "#75676a",
  fontSize: "10px",
  fontWeight: "700",
  marginBottom: "3px",
};

const selectStyle = {
  width: "100%",
  padding: "7px 9px",
  borderRadius: "7px",
  border: "1px solid #d8c7c3",
  marginBottom: "7px",
  background: "#ffffff",
  color: "#4b3b3f",
  fontSize: "13px",
};

const badgeStyle = {
  padding: "5px 9px",
  borderRadius: "20px",
  fontSize: "10px",
  fontWeight: "700",
  textTransform: "uppercase",
};

const primaryButtonStyle = {
  border: "none",
  padding: "13px 20px",
  borderRadius: "10px",
  background:
    "linear-gradient(135deg, #702f43, #91465d)",
  color: "white",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow:
    "0 6px 18px rgba(112,47,67,0.20)",
};
const secondaryButtonStyle = {
  border: "1px solid #91465d",
  padding: "12px 18px",
  borderRadius: "10px",
  background: "#fffaf8",
  color: "#702f43",
  fontWeight: "700",
  cursor: "pointer",
};

const compactActionButtonStyle = {
  width: "100%",
  padding: "8px 6px",
  border: "none",
  borderRadius: "7px",
  fontWeight: "600",
  fontSize: "13px",
  cursor: "pointer",
};

