import api from "./axios";

export const fetchBooks = async (page = 1, limit = 5) => {
  const res = await api.get(`books?page=${page}&limit=${limit}`);
  return res.data;
};

export const fetchAllBooks = async () => {
  const res = await api.get(`books?all=true`);
  return res.data.data;
};

export const getBookById = async (id) => {
  const res = await api.get(`books/${id}`);
  return res.data;
};

export const createBook = async (data) => {
  const res = await api.post("books", data);
  return res.data;
};

export const updateBook = async (id, data) => {
  const res = await api.put(`books/${id}`, data);
  return res.data;
};

export const deleteBook = async (id) => {
  const res = await api.delete(`books/${id}`);
  return res.data;
};
