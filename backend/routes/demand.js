const express = require('express');
const router = express.Router();
const demandController = require('../controllers/demandController');

router.get('/', demandController.getAllDemand);
router.post('/', demandController.addDemand);

module.exports = router;
