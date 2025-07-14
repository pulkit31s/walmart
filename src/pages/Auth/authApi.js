import api from '../api';

export const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
};

export const login = async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data.token) {
        localStorage.setItem('token', res.data.token);
    }
    return res.data;
};
