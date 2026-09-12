import axios from "axios";
const API = "http://localhost:5000/api/sprints";

// ========================================
// GET AUTH TOKEN
// ========================================

const getToken = () => {
  return localStorage.getItem("token");
};

// ========================================
// AUTH CONFIG
// ========================================

const getAuthConfig = () => {
  return {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
};

// ========================================
// GET ALL SPRINTS
// ========================================

export const getSprints = async () => {
  const res = await axios.get(
    API,
    getAuthConfig()
  );

  return res.data;
};

// ========================================
// CREATE SPRINT
// ========================================

export const createSprint = async (data) => {
  const res = await axios.post(
    API,
    data,
    getAuthConfig()
  );

  return res.data;
};

// ========================================
// UPDATE SPRINT
// ========================================

export const updateSprint = async (id, data) => {
  const res = await axios.put(
    `${API}/${id}`,
    data,
    getAuthConfig()
  );

  return res.data;
};

// ========================================
// DELETE SPRINT
// ========================================

export const deleteSprint = async (id) => {
  const res = await axios.delete(
    `${API}/${id}`,
    getAuthConfig()
  );


  return res.data;
};
// Add this to frontend/src/services/sprintService.js

export const getSprintHealthRadar = async (sprintId) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`http://localhost:5000/api/sprints/${sprintId}/health-radar`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data.data;
};
export const getSprintReleaseNotes = async (sprintId) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`http://localhost:5000/api/sprints/${sprintId}/release-notes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};