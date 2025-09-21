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

  // Handle Stripe webhooks
  async handleStripeWebhook(body, signature) {
    try {
      if (!stripe) {
        throw new Error('Stripe is not configured');
      }

      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      let event;

      if (webhookSecret) {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } else {
        // For testing without webhook secret
        event = JSON.parse(body);
      }

      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          await this.updateOrderStatusBySessionId(session.id, 'paid');
          console.log('Payment succeeded for session:', session.id);
          break;

        case 'checkout.session.expired':
          const expiredSession = event.data.object;
          await this.updateOrderStatusBySessionId(expiredSession.id, 'canceled');
          console.log('Payment expired for session:', expiredSession.id);
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error('Webhook Error:', error);
      throw error;
    }
  }

  // Update order status by session ID
  async updateOrderStatusBySessionId(sessionId, status = 'paid') {
    try {
      const order = await paymentRepository.findOrderByTransactionId(sessionId);
      if (order) {
        await paymentRepository.updateOrderStatus(order.id, status, sessionId);
        console.log(`Updated order ${order.id} status to ${status}`);
        return order;
      } else {
        console.log(`Order not found for session ${sessionId}`);
        return null;
      }
    } catch (error) {
      console.error('Status Update Error:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();
