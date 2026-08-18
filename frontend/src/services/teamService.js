import axios from "axios";

const API = "http://localhost:5000/api/team";

// ========================================
// GET TOKEN
// ========================================

const getToken = () => {
  return localStorage.getItem("token");
};

// ========================================
// AUTH HEADERS
// ========================================

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// ========================================
// GET TEAM MEMBERS
// ========================================

export const getTeamMembers = async () => {
  const res = await axios.get(
    API,
    authHeaders()
  );

  return res.data;
};

// ========================================
// ADD TEAM MEMBER
// ========================================

export const addTeamMember = async (data) => {
  const res = await axios.post(
    API,
    data,
    authHeaders()
  );

  return res.data;
};

// ========================================
// DELETE TEAM MEMBER
// ========================================

export const deleteTeamMember = async (id) => {
  const res = await axios.delete(
    `${API}/${id}`,
    authHeaders()
  );

  return res.data;
};

// ========================================
// ASSIGN ISSUE TO TEAM MEMBER
// ========================================

export const assignIssueToTeamMember = async (
  memberId,
  issueData
) => {
  const res = await axios.post(
    `${API}/${memberId}/assign`,
    issueData,
    authHeaders()
  );

  return res.data;
};

// ========================================
// UPDATE ASSIGNED TASK STATUS
// ========================================

export const updateAssignedTaskStatus = async (
  memberId,
  taskId,
  status
) => {
  const res = await axios.put(
    `${API}/${memberId}/task-status`,
    {
      taskId,
      status,
    },
    authHeaders()
  );

  return res.data;
};