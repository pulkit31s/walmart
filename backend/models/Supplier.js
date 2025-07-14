const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String },
    performanceScore: { type: Number, default: 0 },
    lastEvaluated: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Supplier', SupplierSchema);
