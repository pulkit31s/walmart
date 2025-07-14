const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricingController');

router.get('/', pricingController.getAllPricing);
router.post('/', pricingController.addPricing);

module.exports = router;
