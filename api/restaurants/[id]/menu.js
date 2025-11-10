import Restaurant from '../../../models/Restaurant.js';
import { getMockMenuItems } from '../../../lib/mockData.js';
import { 
  isLocalRequest,
  connectToDB,
  setCORSHeaders, 
  handlePreflight, 
  validateMethod, 
  handleError 
} from '../../../lib/apiHelpers.js';
import {
  filterMenuItems,
  sortMenuItems,
  calculatePagination,
  applyPagination,
  calculateCategoryStats
} from '../../../lib/restaurantHelpers.js';

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
    const { id } = req.query;
    const { category, dietary, search, type = 'all', limit = 50, page = 1 } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant ID is required'
      });
    }
    
    // Check if request is from localhost/local network
    const isLocal = isLocalRequest(req);
    
    if (isLocal) {
      // Return mock data for local requests
      let mockDishes = getMockMenuItems(id);
      
      // Apply filters to mock data
      mockDishes = filterMenuItems(mockDishes, { category, dietary, search });
      
      // Sort dishes
      mockDishes = sortMenuItems(mockDishes);
      
      // Apply pagination
      const paginatedDishes = applyPagination(mockDishes, page, limit);
      const pagination = calculatePagination(page, limit, mockDishes.length);
      
      // Get category counts from all mock dishes
      const allMockDishes = getMockMenuItems(id);
      const categoryStats = calculateCategoryStats(allMockDishes);
      
      return res.status(200).json({
        success: true,
        message: 'Menu items retrieved successfully (mock data)',
        data: {
          menu: paginatedDishes,
          categoryStats,
          pagination
        }
      });
    }
    
    // For production, connect to DB and fetch
    await connectToDB();
    
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
    dishes = filterMenuItems(dishes, { category, dietary, search });
    
    // Sort dishes
    dishes = sortMenuItems(dishes);
    
    // Apply pagination
    const paginatedDishes = applyPagination(dishes, page, limit);
    const pagination = calculatePagination(page, limit, dishes.length);
    
    // Get category counts
    const categoryStats = calculateCategoryStats(restaurant.dishes || []);
    
    res.status(200).json({
      success: true,
      message: 'Menu items retrieved successfully',
      data: {
        menu: paginatedDishes,
        categoryStats,
        pagination
      }
    });
    
  } catch (error) {
    handleError(error, res, 'Internal server error');
  }
}