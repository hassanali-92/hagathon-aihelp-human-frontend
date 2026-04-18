import axios from 'axios';

const api = axios.create({
    // Dono options rakhein: local aur production (env se handle karein)
    baseURL: import.meta.env.VITE_API_URL || 'https://hagathon-aihelp-human-backend.onrender.com/',
    timeout: 30000, 
    headers: {
        'Content-Type': 'application/json'
    }
});

// --- Request Interceptor ---
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Bearer token lagane ka standard tareeqa
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- Response Interceptor ---
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config;

        // 1. Agar 401 (Unauthorized) aaye toh logout logic
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.warn("Token expired or invalid. Logging out...");
            
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Hackathon Tip: Agar window.location use karna hai toh check karein 
            // ke user pehle se login page par toh nahi
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        // 2. Render Cold Start handling (Optional message)
        if (error.code === 'ECONNABORTED') {
            console.error("Server taking too long (Cold Start)... Please wait.");
        }

        return Promise.reject(error);
    }
);

export default api;
