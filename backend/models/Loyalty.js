const mongoose = require('mongoose');

const LoyaltySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    points: { type: Number, default: 0 },
    tier: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], default: 'Bronze' },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Loyalty', LoyaltySchema);
