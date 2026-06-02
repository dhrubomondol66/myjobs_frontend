import API from "./api";

// Register
export const registerUser = (data) => {
  return API.post("/accounts/register/", data);
};

// Login
export const loginUser = (data) => {
  return API.post("/accounts/login/", data);
};

// Forgot password
// NOTE: Endpoint name may differ in your backend; update if needed.
export const forgotPassword = (data) => {
  return API.post("/accounts/forgot-password/", data);
};

// Reset password
// NOTE: Endpoint name may differ in your backend; update if needed.
export const resetPassword = (data) => {
  return API.post("/accounts/reset-password/", data);
};