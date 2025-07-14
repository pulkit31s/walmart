
import api from '../../api';

export const fetchInventory = async () => {
    const res = await api.get('/inventory');
    return res.data;
};

export const addInventory = async (item) => {
    const res = await api.post('/inventory', item);
    return res.data;
};

export const updateInventory = async (id, item) => {
    const res = await api.put(`/inventory/${id}`, item);
    return res.data;
};

export const deleteInventory = async (id) => {
    const res = await api.delete(`/inventory/${id}`);
    return res.data;
};
