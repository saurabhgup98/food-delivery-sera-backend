import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Chat endpoint for AI assistance
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { message, userContext } = req.body;
    const userId = req.user?.id;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Simple AI response logic based on message content
    // In production, this would integrate with ChatGPT API
    const response = generateAIResponse(message.toLowerCase(), userContext);

    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Simple AI response generator (replace with ChatGPT API in production)
function generateAIResponse(message: string, userContext: any): string {
  const { isLoggedIn, userName, cartItems, cartTotal } = userContext;

  // Order status queries
  if (message.includes('where is my order') || message.includes('order status')) {
    return isLoggedIn 
      ? `Hi ${userName}! I can help you track your order. Please check your order history in the Orders section, or let me know your order number for specific details.`
      : 'To check your order status, please log in to your account first. You can find your order history in the Orders section.';
  }

  // Payment help
  if (message.includes('payment') || message.includes('pay') || message.includes('billing')) {
    return 'I can help with payment issues! You can use credit/debit cards, UPI, or digital wallets. If you\'re having trouble, please provide your order number and I\'ll assist you further.';
  }

  // Menu recommendations
  if (message.includes('recommend') || message.includes('suggest') || message.includes('what should i eat')) {
    return 'Great question! I can recommend dishes based on your preferences. What type of cuisine are you in the mood for? You can also check our "Popular" and "Trending" sections for the best picks!';
  }

  // Delivery issues
  if (message.includes('delivery') || message.includes('late') || message.includes('driver')) {
    return 'I\'m sorry to hear about delivery issues. Please provide your order number and I\'ll help you track it or contact the delivery partner. We\'re here to make it right!';
  }

  // Cart related
  if (message.includes('cart') || message.includes('basket')) {
    if (cartItems > 0) {
      return `I can see you have ${cartItems} items in your cart totaling ₹${cartTotal}. Ready to checkout? You can also add more items or modify your order.`;
    } else {
      return 'Your cart is empty. Browse our restaurants and add some delicious food to get started!';
    }
  }

  // General help
  if (message.includes('help') || message.includes('support')) {
    return 'I\'m here to help! I can assist with orders, payments, menu recommendations, delivery issues, and more. Just let me know what you need!';
  }

  // Greeting
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return isLoggedIn 
      ? `Hello ${userName}! How can I help you today?`
      : 'Hello! Welcome to our food delivery service. How can I assist you?';
  }

  // Default response
  return 'I understand you\'re asking about "' + message + '". I\'m here to help with food delivery questions, order tracking, payment issues, and menu recommendations. Could you please be more specific about what you need help with?';
}

export default router;

