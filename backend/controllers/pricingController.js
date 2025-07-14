const Pricing = require('../models/Pricing');

exports.getAllPricing = async (req, res) => {
    try {
        const pricing = await Pricing.find();
        res.json(pricing);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.addPricing = async (req, res) => {
    try {
        const entry = new Pricing(req.body);
        await entry.save();
        res.status(201).json(entry);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};
