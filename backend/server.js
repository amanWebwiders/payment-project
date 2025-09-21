// Main Express server setup
const express = require('express');
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes');
const productRoutes = require('./routes/productRoutes');
const sequelize = require('./config/db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/payment', paymentRoutes);
app.use('/api/products', productRoutes);

// Sync DB and start server
sequelize.sync().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log('Server running on port 5000');
  });
});
