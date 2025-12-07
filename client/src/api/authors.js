import axios from "axios";

const API_URL = "http://localhost:3000/authors";

export const fetchAuthors = async (page = 1, limit = 5) => {
  const res = await axios.get(`${API_URL}?page=${page}&limit=${limit}`);
  return res.data;
};

export const createAuthor = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const getAuthorById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const updateAuthor = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteAuthor = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
