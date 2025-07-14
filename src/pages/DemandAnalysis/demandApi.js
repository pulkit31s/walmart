import api from '../../api';

export const fetchDemand = async () => {
    const res = await api.get('/demand');
    return res.data;
};

export const addDemand = async (demandData) => {
    const res = await api.post('/demand', demandData);
    return res.data;
};

export const updateDemand = async (id, demandData) => {
    const res = await api.put(`/demand/${id}`, demandData);
    return res.data;
};

export const deleteDemand = async (id) => {
    const res = await api.delete(`/demand/${id}`);
    return res.data;
};
