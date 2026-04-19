const express = require('express');
const router = express.Router();
const { getFinances, createFinance } = require('../controllers/financeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getFinances).post(protect, createFinance);

module.exports = router;
