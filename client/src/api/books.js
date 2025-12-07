import axios from "axios";

const API_URL = "http://localhost:3000/books";

export const fetchBooks = async (page = 1, limit = 5) => {
  const res = await axios.get(`${API_URL}?page=${page}&limit=${limit}`);
  return res.data;
};

export const fetchAllBooks = async () => {
  const res = await axios.get(`${API_URL}?all=true`);
  return res.data.data;
};

export const getBookById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const createBook = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updateBook = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteBook = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
