import axios from "axios";
const BASE_URL = "http://localhost:3000/dashboards";

export const getDashboardData = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};
