// Express routes for payment endpoints
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/create-checkout-session', paymentController.createCheckoutSession);
router.post('/confirm', paymentController.confirm);

module.exports = router;
