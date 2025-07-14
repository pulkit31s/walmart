import api from '../api';

export const fetchLoyalty = async () => {
    const res = await api.get('/loyalty');
    return res.data;
};

export const addLoyalty = async (loyaltyData) => {
    const res = await api.post('/loyalty', loyaltyData);
    return res.data;
};
export const updateLoyalty = async (id, item) => {
    const res = await api.put(`/loyalty/${id}`, item);
    return res.data;
};

export const deleteLoyalty = async (id) => {
    const res = await api.delete(`/loyalty/${id}`);
    return res.data;
};
