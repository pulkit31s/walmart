import api from '../../api';

export const fetchPricing = async () => {
    const res = await api.get('/pricing');
    return res.data;
};

export const addPricing = async (pricingData) => {
    const res = await api.post('/pricing', pricingData);
    return res.data;
};
export const updatePricing = async (id, item) => {
    const res = await api.put(`/pricing/${id}`, item);
    return res.data;
};

export const deletePricing = async (id) => {
    const res = await api.delete(`/pricing/${id}`);
    return res.data;
};
