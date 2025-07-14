const Supplier = require('../models/Supplier');

exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.addSupplier = async (req, res) => {
    try {
        const supplier = new Supplier(req.body);
        await supplier.save();
        res.status(201).json(supplier);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};
