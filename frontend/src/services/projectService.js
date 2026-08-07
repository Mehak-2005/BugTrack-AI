import axios from "axios";

const API = "http://localhost:5000/api/projects";

const getToken = () => localStorage.getItem("token");

export const getProjects = async () => {
  const res = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return res.data;
};