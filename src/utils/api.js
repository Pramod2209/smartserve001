/**
 * API utility for making requests to the backend
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Set token in localStorage
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Get user from localStorage
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Set user in localStorage
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Remove user from localStorage
export const removeUser = () => {
  localStorage.removeItem('user');
};

/**
 * Make API request
 */
const buildCacheKey = (baseKey, token) => {
  if (!baseKey) return null;
  const tokenSuffix = token ? token.slice(-10) : 'anon';
  return `${baseKey}:${tokenSuffix}`;
};

const readCache = (key) => {
  if (!key) return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      sessionStorage.removeItem(key);
      return null;
    }
    return parsed.value;
  } catch {
    return null;
  }
};

const writeCache = (key, value, ttlMs) => {
  if (!key || !ttlMs) return;
  try {
    const payload = {
      value,
      expiresAt: Date.now() + ttlMs,
    };
    sessionStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // Ignore cache errors.
  }
};

const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const method = (options.method || 'GET').toUpperCase();
  const cacheKey = buildCacheKey(options.cacheKey, token);

  if (method === 'GET' && cacheKey) {
    const cached = readCache(cacheKey);
    if (cached !== null) {
      return cached;
    }
  }
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Add auth token if available
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    if (method === 'GET' && cacheKey) {
      writeCache(cacheKey, data, options.cacheTtlMs);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  getMe: () => apiRequest('/auth/me', { cacheKey: 'auth:me', cacheTtlMs: 30000 }),
};

// Services API
export const servicesAPI = {
  getAll: () => apiRequest('/services'),
  
  getById: (id) => apiRequest(`/services/${id}`),
  
  create: (serviceData) => apiRequest('/services', {
    method: 'POST',
    body: JSON.stringify(serviceData),
  }),
  
  update: (id, serviceData) => apiRequest(`/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(serviceData),
  }),
  
  delete: (id) => apiRequest(`/services/${id}`, {
    method: 'DELETE',
  }),
};

// Bookings API
export const bookingsAPI = {
  getAll: () => apiRequest('/bookings', { cacheKey: 'bookings:all', cacheTtlMs: 15000 }),
  
  getById: (id) => apiRequest(`/bookings/${id}`),
  
  create: (bookingData) => apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),
  
  update: (id, bookingData) => apiRequest(`/bookings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(bookingData),
  }),
  
  delete: (id) => apiRequest(`/bookings/${id}`, {
    method: 'DELETE',
  }),
};

// Users API
export const usersAPI = {
  getAll: (role) => {
    const query = role ? `?role=${role}` : '';
    return apiRequest(`/users${query}`);
  },
  
  getById: (id) => apiRequest(`/users/${id}`),
  
  update: (id, userData) => apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  
  delete: (id) => apiRequest(`/users/${id}`, {
    method: 'DELETE',
  }),
};

// Technicians API
export const techniciansAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/technicians${query}`);
  },
  
  getById: (id) => apiRequest(`/technicians/${id}`),
  
  update: (id, techData) => apiRequest(`/technicians/${id}`, {
    method: 'PUT',
    body: JSON.stringify(techData),
  }),
  
  verify: (id, verified) => apiRequest(`/technicians/${id}/verify`, {
    method: 'PUT',
    body: JSON.stringify({ verified }),
  }),
};

// Reviews API
export const reviewsAPI = {
  getByBooking: (bookingId) => apiRequest(`/reviews/booking/${bookingId}`),

  upsert: (reviewData) => apiRequest('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }),
};
