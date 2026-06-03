import axios from "axios";
import { handle401Error, getErrorMessage } from "../auth/authState.js";

// Different timeouts for different endpoints
const TIMEOUT_MS = {
  default: 150000,    // 15 seconds for most requests
  upload: 300000,     // 30 seconds for file uploads
  auth: 200000,       // 20 seconds for auth endpoints
};

const API = axios.create({
  baseURL: "https://myjobs-backend-b2y5.onrender.com",
  timeout: TIMEOUT_MS.default,
});

// Endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  '/accounts/register/',
  '/accounts/login/',
  '/accounts/forgot-password/',
  '/accounts/forgot-password-verify/',
  '/accounts/reset-password/',
];

// Check if endpoint is public
const isPublicEndpoint = (url) => {
  return PUBLIC_ENDPOINTS.some(endpoint => url?.includes(endpoint));
};

// Attach token automatically (but only for protected endpoints)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("access");
  const isPublic = isPublicEndpoint(req.url);
  
  console.log(`📡 API Request: ${req.method?.toUpperCase()} ${req.baseURL}${req.url}`, {
    isPublic,
    hasToken: !!token,
    data: req.data,
  });
  
  // Only add token for protected endpoints
  if (token && !isPublic) {
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
    const status = err?.response?.status;
    const url = err?.config?.url;
    const method = err?.config?.method?.toUpperCase();
    
    // Different error types
    const isTimeout = err.code === 'ECONNABORTED';
    const isNetworkError = !err?.response;
    const isServerError = status >= 500;
    const isClientError = status >= 400 && status < 500;
    
    let message = getErrorMessage(err);
    if (isTimeout) message = `Request timeout (${TIMEOUT_MS.default}ms exceeded)`;
    if (isNetworkError) message = 'Network error - cannot reach backend server';
    
    console.error(`❌ API Error [${status || 'NETWORK'}]:`, {
      status: status,
      statusText: err?.response?.statusText,
      url: url,
      method: method,
      errorCode: err.code,
      isTimeout,
      isNetworkError,
      isServerError,
      isClientError,
      data: err?.response?.data,
      message: message,
    });
    
    // Detailed timeout error
    if (isTimeout) {
      console.error(`⏱️ TIMEOUT: Request to ${method} ${url} took too long`);
      console.error('   Possible causes:');
      console.error('   - Backend server is offline or slow');
      console.error('   - Network connectivity issue');
      console.error('   - Firewall/proxy blocking the request');
    }
    
    // Detailed network error
    if (isNetworkError && !isTimeout) {
      console.error(`🌐 NETWORK ERROR: Cannot reach ${API.defaults.baseURL}`);
      console.error('   Possible causes:');
      console.error('   - Backend server is offline');
      console.error('   - URL is incorrect');
      console.error('   - CORS not configured on backend');
      console.error('   - Firewall blocking requests');
    }
    
    // Handle 401 Unauthorized
    if (status === 401) {
      console.warn('⚠️ Unauthorized - Token may be expired or invalid');
      handle401Error(url);
    }
    
    return Promise.reject(err);
  }
);

export default API;