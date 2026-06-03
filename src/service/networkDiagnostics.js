/**
 * Network Diagnostics Utility
 * Test backend connectivity and API endpoints
 */

const BACKEND_URL = 'https://myjobs-backend-b2y5.onrender.com';

export const networkDiagnostics = {
  /**
   * Test if backend is reachable
   */
  async testBackendConnectivity() {
    console.group('🌐 Testing Backend Connectivity');
    console.log(`Backend URL: ${BACKEND_URL}`);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${BACKEND_URL}/health/`, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      console.log(`✅ Backend is reachable`);
      console.log(`Status: ${response.status} ${response.statusText}`);
      console.groupEnd();
      return true;
    } catch (error) {
      console.error(`❌ Cannot reach backend`);
      console.error(`Error: ${error.message}`);
      console.error('Possible causes:');
      console.error('  - Backend server is offline');
      console.error('  - Network connectivity issue');
      console.error('  - Firewall/proxy blocking requests');
      console.error('  - CORS not configured on backend');
      console.groupEnd();
      return false;
    }
  },

  /**
   * Test specific endpoint
   */
  async testEndpoint(endpoint, method = 'GET', data = null) {
    console.group(`🧪 Testing Endpoint: ${method} ${endpoint}`);
    
    try {
      const options = {
        method: method,
        signal: AbortSignal.timeout(10000),
      };
      
      if (data) {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify(data);
      }
      
      const url = `${BACKEND_URL}${endpoint}`;
      console.log(`URL: ${url}`);
      
      const response = await fetch(url, options);
      const responseData = await response.json().catch(() => ({}));
      
      console.log(`✅ Response received`);
      console.log(`Status: ${response.status} ${response.statusText}`);
      console.log(`Data:`, responseData);
      console.groupEnd();
      
      return { status: response.status, data: responseData };
    } catch (error) {
      console.error(`❌ Request failed`);
      console.error(`Error: ${error.message}`);
      if (error.name === 'AbortError') {
        console.error('Reason: Request timeout (10 seconds)');
      }
      console.groupEnd();
      return { status: null, error: error.message };
    }
  },

  /**
   * Test public endpoints
   */
  async testPublicEndpoints() {
    console.group('🔓 Testing Public Endpoints');
    
    const endpoints = [
      { method: 'POST', url: '/accounts/register/', data: { email: 'test@example.com', password: 'test123' } },
      { method: 'POST', url: '/accounts/login/', data: { email: 'test@example.com', password: 'test123' } },
      { method: 'POST', url: '/accounts/forgot-password/', data: { email: 'test@example.com' } },
    ];
    
    for (const endpoint of endpoints) {
      console.log(`\n📋 ${endpoint.method} ${endpoint.url}`);
      await this.testEndpoint(endpoint.url, endpoint.method, endpoint.data);
    }
    
    console.groupEnd();
  },

  /**
   * Test auth with token
   */
  async testAuthenticatedEndpoint(endpoint, token) {
    console.group(`🔐 Testing Protected Endpoint: ${endpoint}`);
    
    try {
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        signal: AbortSignal.timeout(10000),
      });
      
      const data = await response.json().catch(() => ({}));
      
      console.log(`Status: ${response.status} ${response.statusText}`);
      console.log(`Data:`, data);
      console.groupEnd();
      
      return { status: response.status, data };
    } catch (error) {
      console.error(`❌ Request failed: ${error.message}`);
      console.groupEnd();
      return { status: null, error: error.message };
    }
  },

  /**
   * Full diagnostic report
   */
  async runFullDiagnostics() {
    console.group('📊 FULL DIAGNOSTIC REPORT');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log(`Backend URL: ${BACKEND_URL}`);
    console.log('');
    
    // Test connectivity
    const isOnline = await this.testBackendConnectivity();
    
    if (!isOnline) {
      console.warn('⚠️ Backend is not reachable. Cannot proceed with endpoint tests.');
      console.groupEnd();
      return;
    }
    
    // Test public endpoints
    console.log('\n');
    await this.testPublicEndpoints();
    
    // Test auth
    const token = localStorage.getItem('access');
    if (token) {
      console.log('\n');
      await this.testAuthenticatedEndpoint('/analytics/summary/', token);
    }
    
    console.groupEnd();
  },
};

/**
 * Usage in browser console:
 * 
 * import { networkDiagnostics } from '@/service/networkDiagnostics.js'
 * 
 * networkDiagnostics.testBackendConnectivity()
 * networkDiagnostics.testEndpoint('/accounts/forgot-password/', 'POST', {email: 'test@example.com'})
 * networkDiagnostics.runFullDiagnostics()
 */

export default networkDiagnostics;
