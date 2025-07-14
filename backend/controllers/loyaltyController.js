const Loyalty = require('../models/Loyalty');

exports.getAllLoyalty = async (req, res) => {
    try {
        const loyalty = await Loyalty.find();
        res.json(loyalty);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.addLoyalty = async (req, res) => {
    try {
        const entry = new Loyalty(req.body);
        await entry.save();
        res.status(201).json(entry);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};
