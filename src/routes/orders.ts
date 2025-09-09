import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  getUserOrders, 
  createOrder, 
  getOrderById, 
  updateOrderStatus 
} from '../controllers/orderController.js';

const router = express.Router();

// Get user orders
router.get('/', protect, getUserOrders);

// Create new order
router.post('/', protect, createOrder);

// Get order by ID
router.get('/:id', protect, getOrderById);

// Update order status
router.patch('/:id/status', protect, updateOrderStatus);

export default router;
