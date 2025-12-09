import api from "./axios";

export const loginRequest = async (email, password) => {
  return api.post("/auth/login", { email, password });
};

export const registerRequest = async (email, password) => {
  return api.post("/auth/register", { email, password });
};
