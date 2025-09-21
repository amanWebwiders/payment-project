// Express routes for product endpoints
const express = require('express');
const router = express.Router();

// Sample electronic products data
const products = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: 999.99,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
    description: "Latest iPhone with advanced camera system",
    category: "smartphones"
  },
  {
    id: 2,
    name: "MacBook Pro M3",
    price: 1999.99,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    description: "Professional laptop with M3 chip",
    category: "laptops"
  },
  {
    id: 3,
    name: "Samsung 4K Smart TV",
    price: 599.99,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
    description: "55-inch 4K Ultra HD Smart TV",
    category: "televisions"
  },
  {
    id: 4,
    name: "Sony WH-1000XM5",
    price: 349.99,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop",
    description: "Noise-cancelling wireless headphones",
    category: "headphones"
  },
  {
    id: 5,
    name: "iPad Pro 12.9",
    price: 1099.99,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
    description: "Professional tablet with M2 chip",
    category: "tablets"
  },
  {
    id: 6,
    name: "Gaming Console",
    price: 499.99,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop",
    description: "Next-gen gaming console",
    category: "gaming"
  },
  {
    id: 7,
    name: "Smart Watch",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    description: "Advanced fitness and health tracking",
    category: "wearables"
  },
  {
    id: 8,
    name: "Wireless Earbuds",
    price: 179.99,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    description: "True wireless earbuds with ANC",
    category: "headphones"
  }
];

// Get all products
router.get('/', (req, res) => {
  try {
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    res.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});

module.exports = router;
