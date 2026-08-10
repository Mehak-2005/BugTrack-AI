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