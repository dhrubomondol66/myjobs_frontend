import axios from "axios";

const API = axios.create({
  baseURL: "https://myjobs-backend-b2y5.onrender.com",
  timeout: 10000,
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("access");
  console.log(`📡 API Request: ${req.method?.toUpperCase()} ${req.baseURL}${req.url}`, {
    hasToken: !!token,
    data: req.data,
  });
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});


API.interceptors.response.use(
  (res) => {
    console.log(`✅ API Response:`, res.status, res.data);
    return res;
  },
  (err) => {
    console.error(`❌ API Error:`, {
      status: err?.response?.status,
      statusText: err?.response?.statusText,
      data: err?.response?.data,
      message: err?.message,
    });
    return Promise.reject(err);
  }
);

export default API;