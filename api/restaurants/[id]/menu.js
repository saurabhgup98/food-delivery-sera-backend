import connectDB from '../../../lib/mongodb.js';
import Restaurant from '../../../models/Restaurant.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }
  
  try {
    // Connect to database
    await connectDB();
    
    const { id } = req.query;
    const { 
      category, 
      dietary, 
      search,
      type = 'all', // all, popular, chef-special, quick-order, trending
      limit = 50,
      page = 1
    } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant ID is required'
      });
    }
    
    // Verify restaurant exists and is active
    const restaurant = await Restaurant.findOne({ 
      _id: id, 
      isActive: true 
    }).lean();
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    // Get dishes from embedded array
    let dishes = restaurant.dishes || [];
    
    // Apply filters
    if (category && category !== 'all') {
      dishes = dishes.filter(dish => dish.category === category);
    }
    
    if (dietary && dietary !== 'all') {
      dishes = dishes.filter(dish => dish.dietary === dietary);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      dishes = dishes.filter(dish => 
        dish.name.toLowerCase().includes(searchLower) ||
        dish.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by type (disabled for now as requested)
    // if (type === 'popular') {
    //   dishes = dishes.filter(dish => dish.isPopular);
    // } else if (type === 'chef-special') {
    //   dishes = dishes.filter(dish => dish.isChefSpecial);
    // } else if (type === 'quick-order') {
    //   dishes = dishes.filter(dish => dish.isQuickOrder);
    // } else if (type === 'trending') {
    //   dishes = dishes.filter(dish => dish.isTrending);
    // }
    
    // Sort dishes
    dishes.sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name));
    
    // Apply pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedDishes = dishes.slice(skip, skip + parseInt(limit));
    
    // Get total count for pagination
    const totalCount = dishes.length;
    
    // Calculate total pages
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    
    // Get category counts
    const categoryCounts = (restaurant.dishes || []).reduce((acc, dish) => {
      acc[dish.category] = (acc[dish.category] || 0) + 1;
      return acc;
    }, {});
    
    res.status(200).json({
      success: true,
      message: 'Menu items retrieved successfully',
      data: {
        menuItems: paginatedDishes,
        categoryStats: categoryCounts,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
    
  } catch (error) {
    console.error('Get menu error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid restaurant ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}