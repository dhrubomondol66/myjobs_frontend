import API from "./api";

export const getDashboardStats = () => {
  return API.get("/analytics/summary/");
};