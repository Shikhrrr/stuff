const API_URL = 'http://127.0.0.1:8000/api';
const BASE_URL = 'http://127.0.0.1:8000';

export const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${BASE_URL}${url}`;
};

export const getAuthToken = () => localStorage.getItem('access_token');
export const setAuthToken = (token) => localStorage.setItem('access_token', token);
export const removeAuthToken = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
}

export const apiUpload = async (endpoint, formData, { method = 'POST', ...customConfig } = {}) => {
    const token = getAuthToken();
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const config = {
        method,
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
        body: formData,
    };
    let response;
    try {
        response = await fetch(`${API_URL}${endpoint}`, config);
    } catch (error) {
        console.error('API Upload Network Error:', error);
        window.dispatchEvent(new CustomEvent('api-error', {
            detail: { message: 'Cannot connect to the server. Please check your connection or try again later.' }
        }));
        return Promise.reject(error);
    }
    if (response.status === 401) {
        removeAuthToken();
        window.location.href = '/login';
        return Promise.reject('Unauthorized');
    }
    if (response.status >= 500) {
        window.dispatchEvent(new CustomEvent('api-error', {
            detail: { message: 'The server encountered an error. Please try again later.' }
        }));
    }
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
        return data;
    } else {
        return Promise.reject(data);
    }
};

export const apiClient = async (endpoint, { body, ...customConfig } = {}) => {
    const token = getAuthToken();
    const headers = { 'Content-Type': 'application/json' };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method: body ? 'POST' : 'GET',
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    let response;
    try {
        response = await fetch(`${API_URL}${endpoint}`, config);
    } catch (error) {
        // Network error (backend down, CORS, etc.)
        console.error('API Client Network Error:', error);
        window.dispatchEvent(new CustomEvent('api-error', { 
            detail: { message: 'Cannot connect to the server. Please check your connection or try again later.' }
        }));
        return Promise.reject(error);
    }
    
    // Very basic refresh token logic can be added here in the future
    if (response.status === 401) {
        // Handle token expiration
        removeAuthToken();
        window.location.href = '/login';
        return Promise.reject('Unauthorized');
    }

    if (response.status >= 500) {
        window.dispatchEvent(new CustomEvent('api-error', { 
            detail: { message: 'The server encountered an error. Please try again later.' }
        }));
    }

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
        return data;
    } else {
        return Promise.reject(data);
    }
};
