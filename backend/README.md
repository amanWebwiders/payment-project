# Payment Project

A full-stack e-commerce application with Node.js backend and React frontend, integrated with Stripe for secure payments.

## Features

- **Product Catalog**: Browse electronic products with images and descriptions
- **Stripe Checkout**: Secure payment processing via Stripe's hosted checkout
- **Database**: MySQL with Sequelize ORM
- **Responsive UI**: Modern React frontend with CSS animations
- **Order Management**: Track orders and payment status

## Tech Stack

### Backend
- Node.js & Express.js
- Sequelize ORM with MySQL
- Stripe Payment Integration
- RESTful API

### Frontend  
- React.js with React Router
- Modern CSS with animations
- Responsive design

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL server running
- Stripe account for API keys

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_mysql_password
   DB_NAME=paymentdb
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   FRONTEND_URL=http://localhost:3000
   ```

4. **Database Setup**:
   ```bash
   # Create database
   npx sequelize-cli db:create
   
   # Run migrations
   npx sequelize-cli db:migrate
   ```

5. **Start backend server**:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start React development server**:
   ```bash
   npm start
   ```
   Frontend runs on `http://localhost:3000`

## Usage

1. **Browse Products**: Visit `http://localhost:3000` to see available electronic items
2. **Make Purchase**: Click "Buy Now" on any product
3. **Secure Checkout**: Complete payment using Stripe's secure checkout page
4. **Test Cards**: Use Stripe test card `4242 4242 4242 4242` for testing

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get specific product

### Payments
- `POST /api/payment/create-checkout-session` - Create Stripe checkout session

## Database Schema

### Orders Table
- `id` - Primary key (auto-increment)
- `amount` - Decimal(10,2) - Order amount
- `status` - ENUM('pending', 'paid', 'failed', 'canceled')
- `transaction_id` - String - Stripe transaction ID
- `payment_method` - String - Payment method used
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

## Security

- Environment variables for sensitive data
- Stripe webhooks for secure payment confirmation
- Input validation and error handling
- CORS enabled for frontend communication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.
