import api from "./axios";

export const fetchAuthors = async (page = 1, limit = 5) => {
  const res = await api.get(`authors?page=${page}&limit=${limit}`);
  return res.data;
};

export const fetchAllAuthors = async () => {
  const res = await api.get(`authors?all=true`);
  return res.data.data;
};

export const createAuthor = async (data) => {
  const res = await api.post("authors", data);
  return res.data;
};

export const getAuthorById = async (id) => {
  const res = await api.get(`authors/${id}`);
  return res.data;
};

export const updateAuthor = async (id, data) => {
  const res = await api.put(`authors/${id}`, data);
  return res.data;
};

export const deleteAuthor = async (id) => {
  const res = await api.delete(`authors/${id}`);
  return res.data;
};
