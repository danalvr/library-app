import api from "./axios";

export const fetchBorrowings = async (
  page = 1,
  limit = 5,
  searchBy,
  keyword
) => {
  const res = await api.get(
    `borrowings?page=${page}&limit=${limit}&searchBy=${searchBy}&keyword=${keyword}`
  );
  return res.data;
};

export const createBorrowing = async (data) => {
  const res = await api.post("borrowings", data);
  return res.data;
};

export const returnBorrowing = async (id, data) => {
  const res = await api.put(`borrowings/${id}`, data);
  return res.data;
};

export const getBorrowingById = async (id) => {
  const res = await api.get(`borrowings/${id}`);
  return res.data;
};

export const updateBorrowing = async (id, data) => {
  const res = await api.put(`borrowings/${id}`, data);
  return res.data;
};

export const deleteBorrowing = async (id) => {
  const res = await api.delete(`borrowings/${id}`);
  return res.data;
};
