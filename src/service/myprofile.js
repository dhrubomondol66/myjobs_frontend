import API from "./api";

// Get my profile
export const getMyProfile = () => {
  return API.get("/myprofile/me/");
};

// Create profile
// export const createProfile = (data) => {
//   return API.post("/myprofile/", data);
// };

// Update profile
export const updateProfile = (data) => {
  return API.put("/myprofile/update/", data);
};