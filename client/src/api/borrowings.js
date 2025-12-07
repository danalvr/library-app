import axios from "axios";

const API_URL = "http://localhost:3000/borrowings";

export const fetchBorrowings = async (page = 1, limit = 5) => {
  const res = await axios.get(`${API_URL}?page=${page}&limit=${limit}`);
  return res.data;
};

export const createBorrowing = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const returnBorrowing = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const getBorrowingById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const updateBorrowing = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteBorrowing = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
