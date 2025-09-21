// Express routes for payment endpoints
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/create-checkout-session', paymentController.createCheckoutSession);
router.post('/confirm', paymentController.confirm);
router.post('/webhook', express.raw({type: 'application/json'}), paymentController.handleWebhook);
router.post('/update-status', paymentController.updateOrderStatus);

module.exports = router;
