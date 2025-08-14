import connectDB from '../../lib/mongodb.js';
import Restaurant from '../../models/Restaurant.js';

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
    
    const { 
      status, 
      cuisine, 
      dietary, 
      priceRange, 
      search,
      limit = 20,
      page = 1
    } = req.query;
    
    // Build filter object
    const filter = { isActive: true };
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (cuisine && cuisine !== 'all') {
      filter.cuisine = { $in: [cuisine] };
    }
    
    if (dietary && dietary !== 'all') {
      filter.dietary = dietary;
    }
    
    if (priceRange && priceRange !== 'all') {
      filter.priceRange = priceRange;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } },
        { popularDishes: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get restaurants with pagination
    const restaurants = await Restaurant.find(filter)
      .sort({ rating: -1, reviewCount: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    // Get total count for pagination
    const totalCount = await Restaurant.countDocuments(filter);
    
    // Calculate total pages
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    
    res.status(200).json({
      success: true,
      message: 'Restaurants retrieved successfully',
      data: {
        restaurants,
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
    console.error('Get restaurants error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
