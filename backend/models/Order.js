const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'canceled'),
    allowNull: false,
    defaultValue: 'pending'
  },
  transaction_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true, // This enables createdAt and updatedAt
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Order;
