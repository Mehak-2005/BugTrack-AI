import axios from "axios";

const API = "http://localhost:5000/api/sprints";

const getToken = () => localStorage.getItem("token");

export const getSprints = async () => {
  const res = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return res.data;
};

export const createSprint = async (data) => {
  const res = await axios.post(API, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return res.data;
};

export const updateSprint = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return res.data;
};

export const deleteSprint = async (id) => {
  await axios.delete(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
};