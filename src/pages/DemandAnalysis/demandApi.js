import api from '../api';

export const fetchDemand = async () => {
    const res = await api.get('/demand');
    return res.data;
};

export const addDemand = async (demandData) => {
    const res = await api.post('/demand', demandData);
    return res.data;
};
