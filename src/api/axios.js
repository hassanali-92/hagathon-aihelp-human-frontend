import axios from 'axios';

const api = axios.create({
    // Localhost hata kar Render ka URL dalien
    baseURL: 'https://hagathon-aihelp-human-backend.onrender.com/api', 
});

// Interceptor for token (agar pehle se laga hai toh rehne dein)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
