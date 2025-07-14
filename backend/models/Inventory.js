const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    productName: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    supplier: { type: String },
    lastRestocked: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inventory', InventorySchema);
