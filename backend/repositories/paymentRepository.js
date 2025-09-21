// Handles DB operations for orders
const Order = require('../models/Order');

class PaymentRepository {
  async createOrder(orderData) {
    try {
      const order = await Order.create(orderData);
      return order;
    } catch (error) {
      console.error('Repository Error:', error);
      throw { message: 'DB error', details: error };
    }
  }

  async updateOrderStatus(id, status, transaction_id) {
    try {
      const order = await Order.findByPk(id);
      if (!order) throw { message: 'Order not found' };
      order.status = status;
      order.transaction_id = transaction_id;
      await order.save();
      return order;
    } catch (error) {
      console.error('Repository Error:', error);
      throw { message: 'DB error', details: error };
    }
  }

  async findOrderByTransactionId(transactionId) {
    try {
      const order = await Order.findOne({
        where: { transaction_id: transactionId }
      });
      return order;
    } catch (error) {
      console.error('Repository Error:', error);
      throw { message: 'DB error', details: error };
    }
  }

  async findOrderById(id) {
    try {
      const order = await Order.findByPk(id);
      return order;
    } catch (error) {
      console.error('Repository Error:', error);
      throw { message: 'DB error', details: error };
    }
  }
}

module.exports = new PaymentRepository();
