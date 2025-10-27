const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Mock restaurants data (same as the working API)
const mockRestaurants = [
  {
    _id: '68a483fe72d3b59062bb5d24',
    name: 'Royal Darbar - Luxury Indian Dining',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
    rating: 4.5,
    reviewCount: 1247,
    cuisine: ['Indian', 'North Indian', 'Mughlai'],
    dietary: 'both',
    deliveryTime: '25-35 min',
    deliveryFee: '₹40',
    minimumOrder: '₹200',
    distance: '2.1 km',
    popularDishes: ['Butter Chicken', 'Biryani', 'Naan'],
    offers: ['20% off on orders above ₹500'],
    isOpen: true,
    isFavorite: false,
    priceRange: 'premium',
    features: ['Pure Veg', 'Fast Delivery', 'Best Seller'],
    status: 'OPEN',
    subStatus: 'NORMAL',
    isActive: true
  },
  {
    _id: '68a483fe72d3b59062bb5d25',
    name: 'Pizza Palace',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
    rating: 4.3,
    reviewCount: 892,
    cuisine: ['Italian', 'Pizza', 'Fast Food'],
    dietary: 'both',
    deliveryTime: '20-30 min',
    deliveryFee: '₹30',
    minimumOrder: '₹150',
    distance: '1.8 km',
    popularDishes: ['Margherita Pizza', 'Pepperoni Pizza', 'Garlic Bread'],
    offers: ['Buy 1 Get 1 Free on Pizzas'],
    isOpen: true,
    isFavorite: true,
    priceRange: 'mid-range',
    features: ['Fast Delivery', 'Best Seller'],
    status: 'OPEN',
    subStatus: 'NORMAL',
    isActive: true
  },
  {
    _id: '68a483fe72d3b59062bb5d26',
    name: 'Chinese Corner',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d4d0?w=400',
    rating: 4.2,
    reviewCount: 654,
    cuisine: ['Chinese', 'Asian', 'Fast Food'],
    dietary: 'both',
    deliveryTime: '15-25 min',
    deliveryFee: '₹25',
    minimumOrder: '₹100',
    distance: '1.2 km',
    popularDishes: ['Kung Pao Chicken', 'Fried Rice', 'Spring Rolls'],
    offers: ['10% off on first order'],
    isOpen: true,
    isFavorite: false,
    priceRange: 'budget',
    features: ['Fast Delivery', 'Budget Friendly'],
    status: 'OPEN',
    subStatus: 'NORMAL',
    isActive: true
  },
  {
    _id: '68a483fe72d3b59062bb5d27',
    name: 'Burger Junction',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
    rating: 4.1,
    reviewCount: 423,
    cuisine: ['American', 'Fast Food', 'Burgers'],
    dietary: 'both',
    deliveryTime: '18-28 min',
    deliveryFee: '₹35',
    minimumOrder: '₹120',
    distance: '2.5 km',
    popularDishes: ['Classic Burger', 'Chicken Burger', 'French Fries'],
    offers: ['Combo deals available'],
    isOpen: true,
    isFavorite: false,
    priceRange: 'budget',
    features: ['Fast Delivery', 'Combo Offers'],
    status: 'OPEN',
    subStatus: 'NORMAL',
    isActive: true
  },
  {
    _id: '68a483fe72d3b59062bb5d28',
    name: 'Sushi Master',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    rating: 4.7,
    reviewCount: 156,
    cuisine: ['Japanese', 'Sushi', 'Asian'],
    dietary: 'both',
    deliveryTime: '30-40 min',
    deliveryFee: '₹50',
    minimumOrder: '₹300',
    distance: '3.2 km',
    popularDishes: ['Salmon Sushi', 'California Roll', 'Miso Soup'],
    offers: ['Fresh sushi daily'],
    isOpen: true,
    isFavorite: true,
    priceRange: 'premium',
    features: ['Fresh Ingredients', 'Premium Quality'],
    status: 'OPEN',
    subStatus: 'NORMAL',
    isActive: true
  }
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is healthy!',
    timestamp: new Date().toISOString(),
    status: 'OK',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API root endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Food Delivery Backend API',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      root: '/api',
      health: '/health',
      restaurants: '/api/restaurants'
    }
  });
});

// Restaurants API endpoint (mimics the Vercel function)
app.get('/api/restaurants', (req, res) => {
  try {
    const { 
      status, 
      cuisine, 
      dietary, 
      priceRange, 
      search,
      favorites,
      limit = 20,
      page = 1,
      sortBy = 'rating'
    } = req.query;
    
    // Filter restaurants
    let filteredRestaurants = mockRestaurants.filter(restaurant => {
      if (status && status !== 'all' && restaurant.status !== status) return false;
      if (cuisine && cuisine !== 'all' && !restaurant.cuisine.includes(cuisine)) return false;
      if (dietary && dietary !== 'all' && restaurant.dietary !== dietary) return false;
      if (priceRange && priceRange !== 'all' && restaurant.priceRange !== priceRange) return false;
      if (search && !restaurant.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (favorites === 'true' && !restaurant.isFavorite) return false;
      return true;
    });
    
    // Sort restaurants
    if (sortBy === 'rating') {
      filteredRestaurants.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'deliveryTime') {
      filteredRestaurants.sort((a, b) => {
        const aTime = parseInt(a.deliveryTime.split('-')[0]);
        const bTime = parseInt(b.deliveryTime.split('-')[0]);
        return aTime - bTime;
      });
    }
    
    // Pagination
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedRestaurants = filteredRestaurants.slice(startIndex, endIndex);
    
    res.status(200).json({
      success: true,
      message: 'Restaurants retrieved successfully',
      data: {
        restaurants: paginatedRestaurants,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(filteredRestaurants.length / limitNum),
          totalCount: filteredRestaurants.length,
          hasNextPage: endIndex < filteredRestaurants.length,
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurants',
      error: error.message
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Food Delivery API',
    version: '1.0.0',
    health: '/health',
    api: '/api',
    restaurants: '/api/restaurants'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Local server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🍽️ Restaurants API: http://localhost:${PORT}/api/restaurants`);
  console.log(`📚 API info: http://localhost:${PORT}/api`);
});

module.exports = app;
