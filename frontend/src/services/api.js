import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (userData) => api.post('/auth/register', userData),
};

export const partnerService = {
    getAll: () => api.get('/partners'),
    getById: (id) => api.get(`/partners/${id}`),
    create: (partner) => api.post('/partners', partner),
};

export const memberService = {
    getAll: () => api.get('/members'),
    create: (member) => api.post('/members', member),
    delete: (id) => api.delete(`/members/${id}`),
};

export const eventService = {
    getAll: () => api.get('/events'),
    getById: (id) => api.get(`/events/${id}`),
    create: (event) => api.post('/events', event),
    update: (id, event) => api.put(`/events/${id}`, event),
    delete: (id) => api.delete(`/events/${id}`),
};

export const interactionService = {
    create: (interaction) => api.post('/interactions', interaction),
    getByPartner: (partnerId) => api.get(`/interactions/partner/${partnerId}`),
};

export default api;
