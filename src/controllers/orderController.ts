import { Request, Response } from 'express';
import { User } from '../models/User.js';

// Mock order data for now - in production this would come from a database
const mockOrders = [
  {
    _id: '1',
    restaurantName: 'Pizza Palace',
    items: [
      { name: 'Margherita Pizza', quantity: 2, price: '₹299' },
      { name: 'Garlic Bread', quantity: 1, price: '₹149' }
    ],
    total: 747,
    status: 'delivered',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    rating: 4.5,
    review: 'Great pizza, fast delivery!'
  },
  {
    _id: '2',
    restaurantName: 'Burger King',
    items: [
      { name: 'Whopper', quantity: 1, price: '₹199' },
      { name: 'French Fries', quantity: 1, price: '₹99' }
    ],
    total: 298,
    status: 'preparing',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
  },
  {
    _id: '3',
    restaurantName: 'Sushi Express',
    items: [
      { name: 'California Roll', quantity: 2, price: '₹399' },
      { name: 'Miso Soup', quantity: 1, price: '₹149' }
    ],
    total: 947,
    status: 'delivered',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    rating: 4.8,
    review: 'Fresh and delicious sushi!'
  },
  {
    _id: '4',
    restaurantName: 'Taco Bell',
    items: [
      { name: 'Crunchwrap Supreme', quantity: 1, price: '₹179' },
      { name: 'Nachos', quantity: 1, price: '₹129' }
    ],
    total: 308,
    status: 'out_for_delivery',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },
  {
    _id: '5',
    restaurantName: 'KFC',
    items: [
      { name: 'Chicken Bucket', quantity: 1, price: '₹499' },
      { name: 'Coleslaw', quantity: 1, price: '₹79' }
    ],
    total: 578,
    status: 'cancelled',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  }
];

// Get user orders
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Filter orders by status if provided
    let filteredOrders = mockOrders;
    if (status && status !== 'all') {
      filteredOrders = mockOrders.filter(order => order.status === status);
    }

    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        orders: paginatedOrders,
        total: filteredOrders.length,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(filteredOrders.length / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { restaurantId, items, total, deliveryAddress } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!restaurantId || !items || !total) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: restaurantId, items, total'
      });
    }

    // Create new order (in production, save to database)
    const newOrder = {
      _id: Date.now().toString(),
      restaurantName: 'Restaurant Name', // Would fetch from restaurantId
      items,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      deliveryAddress
    };

    res.status(201).json({
      success: true,
      data: {
        order: newOrder
      },
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const order = mockOrders.find(o => o._id === id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const order = mockOrders.find(o => o._id === id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order status (in production, update in database)
    order.status = status;

    res.json({
      success: true,
      data: {
        order
      },
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
