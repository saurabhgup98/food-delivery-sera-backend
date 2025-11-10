import Restaurant from '../../models/Restaurant.js';
import { getMockRestaurants, getMockRestaurant } from '../../lib/mockData.js';
import { 
  isLocalRequest,
  connectToDB,
  setCORSHeaders, 
  handlePreflight, 
  validateMethod, 
  handleError 
} from '../../lib/apiHelpers.js';
import {
  buildRestaurantFilter,
  buildRestaurantSort,
  filterMockRestaurants,
  calculatePagination,
  applyPagination
} from '../../lib/restaurantHelpers.js';

export default async function handler(req, res) {
  // Set CORS headers
  setCORSHeaders(res);
  
  // Handle preflight requests
  if (handlePreflight(req, res)) {
    return;
  }
  
  // Only allow GET requests
  if (!validateMethod(req, res, 'GET')) {
    return;
  }
  
  try {
    const { id, status, cuisine, dietary, priceRange, search, favorites, limit = 20, page = 1, sortBy = 'rating' } = req.query;
    
    // Check if request is from localhost/local network
    const isLocal = isLocalRequest(req);
    
    // Handle single restaurant request (if id is provided)
    if (id) {
      if (isLocal) {
        // Return mock data for local requests
        const mockRestaurant = getMockRestaurant(id);
        
        return res.status(200).json({
          success: true,
          message: 'Restaurant retrieved successfully (mock data)',
          data: {
            restaurant: mockRestaurant
          }
        });
      }
      
      // For production, connect to DB and fetch
      await connectToDB();
      
      // Find restaurant by ID from database
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
      
      return res.status(200).json({
        success: true,
        message: 'Restaurant retrieved successfully',
        data: {
          restaurant
        }
      });
    }
    
    // Handle list restaurants request (no id provided)
    if (isLocal) {
      // Return mock data for local requests
      let mockRestaurants = getMockRestaurants();
      
      // Debug: Log restaurant names
      console.log('Mock restaurants:', mockRestaurants.map(r => ({ id: r._id, name: r.name, status: r.status })));
      
      // Apply filters to mock data
      mockRestaurants = filterMockRestaurants(mockRestaurants, { status, cuisine, dietary, search });
      
      // Apply pagination
      const paginatedRestaurants = applyPagination(mockRestaurants, page, limit);
      const pagination = calculatePagination(page, limit, mockRestaurants.length);
      
      return res.status(200).json({
        success: true,
        message: 'Restaurants retrieved successfully (mock data)',
        data: {
          restaurants: paginatedRestaurants,
          pagination
        }
      });
    }
    
    // For production, connect to DB and fetch
    await connectToDB();
    
    // Build filter and sort objects
    const filter = buildRestaurantFilter({ status, cuisine, dietary, priceRange, search, favorites });
    const sortObj = buildRestaurantSort(sortBy);
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get restaurants with pagination from database
    const restaurants = await Restaurant.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    // Get total count for pagination
    const totalCount = await Restaurant.countDocuments(filter);
    const pagination = calculatePagination(page, limit, totalCount);
    
    res.status(200).json({
      success: true,
      message: 'Restaurants retrieved successfully',
      data: {
        restaurants,
        pagination
      }
    });
    
  } catch (error) {
    handleError(error, res, 'Internal server error');
  }
}