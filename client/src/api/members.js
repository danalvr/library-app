import axios from "axios";

const API_URL = "http://localhost:3000/members";

export const fetchMembers = async (page = 1, limit = 5) => {
  const res = await axios.get(`${API_URL}?page=${page}&limit=${limit}`);
  return res.data;
};

export const fetchAllMembers = async () => {
  const res = await axios.get(`${API_URL}?all=true`);
  return res.data.data;
};

export const createMember = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const getMemberById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const updateMember = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteMember = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
