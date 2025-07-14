const mongoose = require('mongoose');

const PricingSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    recommendedPrice: { type: Number },
    effectiveDate: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pricing', PricingSchema);
