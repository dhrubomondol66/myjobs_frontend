import API from "./api";

// Get all companies
export const getCompanies = () => {
  return API.get("/companies/");
};

// Create company
export const createCompany = (data) => {
  return API.post("/companies/create/", data);
};

// Get single company
export const getCompany = (id) => {
  return API.get(`/companies/${id}/`);
};