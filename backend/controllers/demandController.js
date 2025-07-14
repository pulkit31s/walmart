const Demand = require('../models/Demand');

exports.getAllDemand = async (req, res) => {
    try {
        const demand = await Demand.find();
        res.json(demand);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.addDemand = async (req, res) => {
    try {
        const entry = new Demand(req.body);
        await entry.save();
        res.status(201).json(entry);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};
