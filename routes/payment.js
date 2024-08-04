const express = require('express');
const router = express.Router();
const {createCharge , refund} = require('../controllers/payment');
// Create a news
router.post('/charge', createCharge);
router.post('/refund', refund);


module.exports = router;
