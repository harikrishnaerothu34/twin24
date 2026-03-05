/**
 * API Configuration
 * Centralizes all backend API endpoints and base URL configuration
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  
  // Devices
  DEVICES: `${API_BASE_URL}/api/devices`,
  DEVICE_BY_ID: (id) => `${API_BASE_URL}/api/devices/${id}`,
  
  // Metrics
  METRICS: `${API_BASE_URL}/api/metrics`,
  METRICS_BY_DEVICE: (deviceId) => `${API_BASE_URL}/api/metrics?deviceId=${deviceId}`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/api/health`
};

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

/**
 * Fetch wrapper with error handling
 * Automatically adds auth token from localStorage
 */
export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    ...API_CONFIG.headers,
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: AbortSignal.timeout(API_CONFIG.timeout)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      const error = new Error(data.message || `HTTP ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    
    return { success: true, data, status: response.status };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Server is not responding.');
    }
    
    if (error instanceof TypeError) {
      throw new Error('Cannot connect to server. Make sure the backend is running on http://localhost:4000');
    }
    
    throw error;
  }
};

export default API_ENDPOINTS;
