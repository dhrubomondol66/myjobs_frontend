/**
 * Authentication state management
 * Tracks login state and handles redirects
 */

let isAuthenticatedState = false;
let authStateListeners = [];

/**
 * Initialize auth state from localStorage
 */
export function initAuthState() {
  isAuthenticatedState = !!localStorage.getItem('access');
  console.log(`[AUTH] Initialized state: ${isAuthenticatedState ? 'Logged In' : 'Logged Out'}`);
  return isAuthenticatedState;
}

/**
 * Get current auth state
 */
export function getAuthState() {
  return isAuthenticatedState;
}

/**
 * Set auth state when user logs in
 */
export function setAuthState(authenticated) {
  const changed = isAuthenticatedState !== authenticated;
  isAuthenticatedState = authenticated;
  
  if (changed) {
    console.log(`[AUTH] State changed: ${authenticated ? 'Logged In' : 'Logged Out'}`);
    notifyAuthStateChanged(authenticated);
  }
  
  return authenticated;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChanged(callback) {
  authStateListeners.push(callback);
  return () => {
    authStateListeners = authStateListeners.filter(cb => cb !== callback);
  };
}

/**
 * Notify all listeners of auth state change
 */
function notifyAuthStateChanged(authenticated) {
  authStateListeners.forEach(callback => callback(authenticated));
}

/**
 * Handle 401 Unauthorized errors
 */
export function handle401Error(endpoint) {
  console.error(`[AUTH] 401 Unauthorized on ${endpoint}`);
  console.warn('[AUTH] Your session may have expired. Please log in again.');
  
  // Clear tokens
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  
  // Update state
  setAuthState(false);
  
  // Optional: Redirect to login
  // window.location.href = '/login';
}

/**
 * Get readable error message for API errors
 */
export function getErrorMessage(error) {
  const status = error?.response?.status;
  const data = error?.response?.data;
  
  switch (status) {
    case 400:
      return data?.detail || data?.message || 'Invalid request';
    case 401:
      return 'Your session has expired. Please log in again.';
    case 403:
      return 'You do not have permission to access this resource';
    case 404:
      return 'Resource not found';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return data?.detail || data?.message || error?.message || 'An error occurred';
  }
}
