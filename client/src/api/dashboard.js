import api from "./axios";

export const getDashboardData = async () => {
  const res = await api.get("dashboards");
  return res.data;
};
