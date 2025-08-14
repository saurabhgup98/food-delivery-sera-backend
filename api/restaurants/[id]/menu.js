import connectDB from '../../../lib/mongodb.js';
import MenuItem from '../../../models/MenuItem.js';
import Restaurant from '../../../models/Restaurant.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://food-delivery-sera.vercel.app');
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
    });
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    // Build filter object
    const filter = { 
      restaurantId: id,
      isAvailable: true 
    };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (dietary && dietary !== 'all') {
      filter.dietary = dietary;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by type
    if (type === 'popular') {
      filter.isPopular = true;
    } else if (type === 'chef-special') {
      filter.isChefSpecial = true;
    } else if (type === 'quick-order') {
      filter.isQuickOrder = true;
    } else if (type === 'trending') {
      filter.isTrending = true;
    }
    
    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get menu items with pagination
    const menuItems = await MenuItem.find(filter)
      .sort({ rating: -1, name: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    // Get total count for pagination
    const totalCount = await MenuItem.countDocuments(filter);
    
    // Calculate total pages
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    
    // Get category counts
    const categoryCounts = await MenuItem.aggregate([
      { $match: { restaurantId: id, isAvailable: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const categoryStats = categoryCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});
    
    res.status(200).json({
      success: true,
      message: 'Menu items retrieved successfully',
      data: {
        menuItems,
        categoryStats,
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
