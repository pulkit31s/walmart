const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

router.get('/', supplierController.getAllSuppliers);
router.post('/', supplierController.addSupplier);

module.exports = router;
