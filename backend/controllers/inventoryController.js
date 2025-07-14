const Inventory = require('../models/Inventory');

exports.getAllInventory = async (req, res) => {
    try {
        const items = await Inventory.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.addInventory = async (req, res) => {
    try {
        const item = new Inventory(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};
