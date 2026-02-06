import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 60000 // 60 seconds (increased for comparison endpoint)
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // You can add auth tokens here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response.data; // Return only data
    },
    (error) => {
        // Handle errors globally
        const message = error.response?.data?.error?.message || error.message || 'An error occurred';
        console.error('API Error:', message);
        return Promise.reject(new Error(message));
    }
);

// API endpoints
export const githubAPI = {
    analyze: (username) => api.post('/github/analyze', { githubUsername: username }),
    getUser: (username) => api.get(`/github/${username}`),
    refresh: (username) => api.post(`/github/refresh/${username}`)
};

export const comparisonAPI = {
    compare: (userA, userB) => api.post('/compare', { usernameA: userA, usernameB: userB }),
    getComparison: (userA, userB) => api.get(`/compare/${userA}/${userB}`)
};

export const leetCodeAPI = {
    analyze: (username) => api.post('/leetcode/analyze', { username }),
    getUser: (username) => api.get(`/leetcode/${username}`)
};

export default api;
