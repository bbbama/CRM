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
    update: (id, partner) => api.put(`/partners/${id}`, partner),
    delete: (id) => api.delete(`/partners/${id}`),
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

export const editionService = {
    getByEvent: (eventId) => api.get(`/events/${eventId}/editions`),
    getById: (eventId, id) => api.get(`/events/${eventId}/editions/${id}`),
    create: (eventId, edition) => api.post(`/events/${eventId}/editions`, edition),
    update: (eventId, id, edition) => api.put(`/events/${eventId}/editions/${id}`, edition),
    delete: (eventId, id) => api.delete(`/events/${eventId}/editions/${id}`),
};

export const interactionService = {
    create: (interaction) => api.post('/interactions', interaction),
    getByPartner: (partnerId) => api.get(`/interactions/partner/${partnerId}`),
};

export const contactService = {
    getByPartner: (partnerId) => api.get(`/contacts/partner/${partnerId}`),
    create: (contact) => api.post('/contacts', contact),
    update: (id, contact) => api.put(`/contacts/${id}`, contact),
    delete: (id) => api.delete(`/contacts/${id}`),
};

export const contactNoteService = {
    getByContact: (contactId) => api.get(`/contacts/${contactId}/notes`),
    create: (contactId, content) => api.post(`/contacts/${contactId}/notes`, { content }),
    delete: (contactId, noteId) => api.delete(`/contacts/${contactId}/notes/${noteId}`),
};

export default api;
