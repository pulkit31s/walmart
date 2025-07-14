const mongoose = require('mongoose');

const DemandSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    date: { type: Date, required: true },
    demand: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Demand', DemandSchema);
