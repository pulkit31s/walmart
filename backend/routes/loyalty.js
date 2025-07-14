const express = require('express');
const router = express.Router();
const loyaltyController = require('../controllers/loyaltyController');

router.get('/', loyaltyController.getAllLoyalty);
router.post('/', loyaltyController.addLoyalty);

module.exports = router;
