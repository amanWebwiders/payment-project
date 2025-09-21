// Handles HTTP requests for payments
const paymentService = require('../services/paymentService');

const paymentController = {
  async createCheckoutSession(req, res) {
    try {
      const { amount, productId, productName, description, image } = req.body;
      const productData = { amount, productId, productName, description, image };
      const result = await paymentService.createCheckoutSession(productData);
      res.json({ success: true, ...result });
    } catch (error) {
      console.error('Controller Error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async confirm(req, res) {
    try {
      const { orderId, paymentIntentId } = req.body;
      const result = await paymentService.confirmPayment(orderId, paymentIntentId);
      res.json({ success: result.success });
    } catch (error) {
      console.error('Controller Error:', error);
      res.status(500).json({ success: false, error });
    }
  },
};

module.exports = paymentController;
