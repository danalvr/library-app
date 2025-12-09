import api from "./axios";

export const fetchMembers = async (page = 1, limit = 5) => {
  const res = await api.get(`members?page=${page}&limit=${limit}`);
  return res.data;
};

export const fetchAllMembers = async () => {
  const res = await api.get(`members?all=true`);
  return res.data.data;
};

export const createMember = async (data) => {
  const res = await api.post("members", data);
  return res.data;
};

export const getMemberById = async (id) => {
  const res = await api.get(`members/${id}`);
  return res.data;
};

export const updateMember = async (id, data) => {
  const res = await api.put(`members/${id}`, data);
  return res.data;
};

export const deleteMember = async (id) => {
  const res = await api.delete(`members/${id}`);
  return res.data;
};
