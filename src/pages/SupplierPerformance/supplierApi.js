
import api from '../../api';

export const fetchSuppliers = async () => {
    const res = await api.get('/suppliers');
    return res.data;
};

export const addSupplier = async (supplierData) => {
    const res = await api.post('/suppliers', supplierData);
    return res.data;
};

export const updateSupplier = async (id, item) => {
    const res = await api.put(`/suppliers/${id}`, item);
    return res.data;
};

export const deleteSupplier = async (id) => {
    const res = await api.delete(`/suppliers/${id}`);
    return res.data;
};
