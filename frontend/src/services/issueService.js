import axios from "axios";

const API = "http://localhost:5000/api/issues";
const AI_API = "http://localhost:5000/api/ai";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// ========================================
// GET ALL ISSUES
// ========================================

export const getIssues = async () => {
  const res = await axios.get(API, authHeaders());

  return res.data;
};

// ========================================
// CREATE ISSUE
// ========================================

export const createIssue = async (data) => {
  const res = await axios.post(
    API,
    data,
    authHeaders()
  );

  return res.data;
};

// ========================================
// UPDATE ISSUE
// ========================================

export const updateIssue = async (id, data) => {
  const res = await axios.put(
    `${API}/${id}`,
    data,
    authHeaders()
  );

  return res.data;
};

// ========================================
// DELETE ISSUE
// ========================================

export const deleteIssue = async (id) => {
  const res = await axios.delete(
    `${API}/${id}`,
    authHeaders()
  );

  return res.data;
};

// ========================================
// SAVE ISSUE
// ========================================

export const saveIssue = async (id) => {
  const res = await axios.post(
    `${API}/save`,
    { issueId: id },
    authHeaders()
  );

  return res.data;
};

// ========================================
// GET SAVED ISSUES
// ========================================

export const getSavedIssues = async () => {
  const res = await axios.get(
    `${API}/saved`,
    authHeaders()
  );

  return res.data;
};

// ========================================
// AI BUG TRIAGE
// ========================================
// Milestone 2
// Automatically determines:
// - Category
// - Severity
// ========================================

export const analyzeBug = async (description) => {
  const res = await axios.post(
    `${AI_API}/triage`,
    {
      description,
    },
    authHeaders()
  );

  return res.data;
};
// ========================================
// ANALYTICS
// Milestone 3
// ========================================

// GET GENERAL ANALYTICS
export const getAnalytics = async () => {
  const res = await axios.get(
    `${API}/analytics`,
    authHeaders()
  );

  return res.data;
};

// GET DEVELOPER WORKLOAD
export const getDeveloperWorkload = async () => {
  const res = await axios.get(
    `${API}/analytics/developer-workload`,
    authHeaders()
  );

  return res.data;
};

// GET DEFECT TRENDS
export const getDefectTrends = async () => {
  const res = await axios.get(
    `${API}/analytics/trends`,
    authHeaders()
  );

  return res.data;
};

// GET AVERAGE RESOLUTION TIME
export const getAverageResolutionTime = async () => {
  const res = await axios.get(
    `${API}/analytics/resolution-time`,
    authHeaders()
  );

  return res.data;
};
