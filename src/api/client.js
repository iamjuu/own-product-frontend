const API_BASE_URL = '/api';

export const getToken = () => {
  return localStorage.getItem('master_admin_token') || '';
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('master_admin_token', token);
  } else {
    localStorage.removeItem('master_admin_token');
  }
};

export const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'API request failed');
      error.status = response.status;
      error.code = data.code || 'UNKNOWN_ERROR';
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, error.message);
    throw error;
  }
};

export const get = (endpoint, params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return request(`${endpoint}${queryString}`, { method: 'GET' });
};

export const post = (endpoint, body = {}) => {
  return request(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export const patch = (endpoint, body = {}) => {
  return request(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
};

export const del = (endpoint) => {
  return request(endpoint, { method: 'DELETE' });
};

const ApiClient = {
  getToken,
  setToken,
  request,
  get,
  post,
  patch,
  delete: del,
};

export default ApiClient;
