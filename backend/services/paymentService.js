// Business logic for payments
const paymentRepository = require('../repositories/paymentRepository');
const Stripe = require('stripe');
require('dotenv').config();

// Initialize Stripe with error handling
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey || stripeSecretKey === 'sk_test_your_stripe_secret_key_here') {
  console.warn('⚠️  Stripe API key not configured properly. Please set STRIPE_SECRET_KEY in .env file');
}
const stripe = stripeSecretKey && stripeSecretKey !== 'sk_test_your_stripe_secret_key_here' ? Stripe(stripeSecretKey) : null;

class PaymentService {
  async createCheckoutSession(productData) {
    try {
      if (!stripe) {
        throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY in .env file');
      }
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: productData.productName,
                description: productData.description || '',
                images: productData.image ? [productData.image] : [],
              },
              unit_amount: Math.round(productData.amount * 100), // Stripe expects cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cancel`,
        metadata: {
          productId: productData.productId || '',
          productName: productData.productName || ''
        }
      });
      
      // Save order with status 'pending'
      const order = await paymentRepository.createOrder({
        amount: productData.amount,
        status: 'pending',
        transaction_id: session.id,
        payment_method: 'stripe'
      });
      
      return { 
        sessionId: session.id, 
        sessionUrl: session.url, 
        orderId: order.id 
      };
    } catch (error) {
      console.error('Service Error:', error);
      throw { message: 'Payment intent error', details: error };
    }
  }

  async confirmPayment(orderId, paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status === 'succeeded') {
        await paymentRepository.updateOrderStatus(orderId, 'paid', paymentIntentId);
        return { success: true };
      } else {
        await paymentRepository.updateOrderStatus(orderId, 'failed', paymentIntentId);
        return { success: false };
      }
    } catch (error) {
      console.error('Service Error:', error);
      throw { message: 'Confirm payment error', details: error };
    }
  }
}

module.exports = new PaymentService();
