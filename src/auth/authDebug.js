/**
 * Authentication debugging and management utilities
 */

export const authDebug = {
  /**
   * Check current authentication status
   */
  getStatus() {
    const access = localStorage.getItem('access');
    const refresh = localStorage.getItem('refresh');
    
    return {
      isAuthenticated: !!access,
      hasAccessToken: !!access,
      hasRefreshToken: !!refresh,
      accessToken: access ? `${access.substring(0, 20)}...` : null,
      refreshToken: refresh ? `${refresh.substring(0, 20)}...` : null,
    };
  },

  /**
   * Log current auth state to console
   */
  log() {
    const status = this.getStatus();
    console.group('🔐 Authentication Status');
    console.log('Authenticated:', status.isAuthenticated);
    console.log('Access Token:', status.hasAccessToken ? '✅ Present' : '❌ Missing');
    console.log('Refresh Token:', status.hasRefreshToken ? '✅ Present' : '❌ Missing');
    console.groupEnd();
    return status;
  },

  /**
   * Decode JWT token to see its contents (without verification)
   */
  decodeToken(token = null) {
    const accessToken = token || localStorage.getItem('access');
    if (!accessToken) {
      console.warn('❌ No access token found');
      return null;
    }

    try {
      const parts = accessToken.split('.');
      if (parts.length !== 3) {
        console.error('❌ Invalid token format');
        return null;
      }

      const decoded = JSON.parse(atob(parts[1]));
      console.group('🔍 Token Decoded');
      console.table(decoded);
      console.log('Expires at:', new Date(decoded.exp * 1000));
      console.groupEnd();
      return decoded;
    } catch (error) {
      console.error('❌ Failed to decode token:', error.message);
      return null;
    }
  },

  /**
   * Check if token is expired
   */
  isTokenExpired(token = null) {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;

    const expiryTime = decoded.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    const isExpired = now > expiryTime;

    console.log(`⏰ Token expires in ${Math.round((expiryTime - now) / 1000)} seconds`);
    if (isExpired) {
      console.warn('⚠️ Token is EXPIRED');
    } else {
      console.log('✅ Token is valid');
    }

    return isExpired;
  },

  /**
   * Clear all auth data
   */
  clear() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    console.log('🧹 Cleared all auth tokens');
  },

  /**
   * Test API call to check authentication
   */
  async testApiCall(apiModule) {
    try {
      console.log('🧪 Testing API call with current authentication...');
      // This would be a simple endpoint that requires auth
      // Adjust based on your API
      const response = await apiModule.get('/api/user/me');
      console.log('✅ API call successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ API call failed:', {
        status: error?.response?.status,
        message: error?.response?.data?.message,
      });
      return null;
    }
  },
};

/**
 * Usage in browser console:
 * 
 * authDebug.log()              // Check auth status
 * authDebug.decodeToken()      // See token contents
 * authDebug.isTokenExpired()   // Check if expired
 * authDebug.clear()            // Clear all tokens
 */

export default authDebug;
