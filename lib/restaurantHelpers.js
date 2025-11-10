/**
 * Restaurant-specific helper functions
 * Handles filtering, sorting, pagination for restaurants and menu items
 */

/**
 * Build MongoDB filter object for restaurants
 * @param {Object} query - Query parameters
 * @returns {Object} MongoDB filter object
 */
export function buildRestaurantFilter(query) {
  const { status, cuisine, dietary, priceRange, search, favorites } = query;
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
  
  if (favorites === 'true') {
    filter.isFavorite = true;
  }
  
  return filter;
}

/**
 * Build MongoDB sort object for restaurants
 * @param {string} sortBy - Sort field (rating, name, deliveryTime)
 * @returns {Object} MongoDB sort object
 */
export function buildRestaurantSort(sortBy = 'rating') {
  let sortObj = {};
  
  if (sortBy === 'rating') {
    sortObj = { rating: -1, reviewCount: -1 };
  } else if (sortBy === 'name') {
    sortObj = { name: 1 };
  } else if (sortBy === 'deliveryTime') {
    sortObj = { deliveryTime: 1 };
  }
  
  return sortObj;
}

/**
 * Filter mock restaurants array based on query parameters
 * @param {Array} restaurants - Array of mock restaurants
 * @param {Object} query - Query parameters
 * @returns {Array} Filtered restaurants array
 */
export function filterMockRestaurants(restaurants, query) {
  const { status, cuisine, dietary, search } = query;
  let filtered = [...restaurants];
  
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(r => 
      r.name.toLowerCase().includes(searchLower) ||
      r.cuisine.some(c => c.toLowerCase().includes(searchLower))
    );
  }
  
  if (cuisine && cuisine !== 'all') {
    filtered = filtered.filter(r => 
      r.cuisine.some(c => c.toLowerCase() === cuisine.toLowerCase())
    );
  }
  
  if (dietary && dietary !== 'all') {
    filtered = filtered.filter(r => r.dietary === dietary);
  }
  
  if (status && status !== 'all') {
    filtered = filtered.filter(r => r.status === status.toUpperCase());
  }
  
  return filtered;
}

/**
 * Filter menu items array based on query parameters
 * @param {Array} dishes - Array of menu items
 * @param {Object} query - Query parameters
 * @returns {Array} Filtered menu items array
 */
export function filterMenuItems(dishes, query) {
  const { category, dietary, search } = query;
  let filtered = [...dishes];
  
  if (category && category !== 'all') {
    filtered = filtered.filter(dish => dish.category === category);
  }
  
  if (dietary && dietary !== 'all') {
    filtered = filtered.filter(dish => dish.dietary === dietary);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(dish => 
      dish.name.toLowerCase().includes(searchLower) ||
      dish.description.toLowerCase().includes(searchLower)
    );
  }
  
  return filtered;
}

/**
 * Sort menu items by rating and name
 * @param {Array} dishes - Array of menu items
 * @returns {Array} Sorted menu items array
 */
export function sortMenuItems(dishes) {
  const sorted = [...dishes];
  sorted.sort((a, b) => {
    // Sort by rating (descending), then by name (ascending)
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    return a.name.localeCompare(b.name);
  });
  return sorted;
}

/**
 * Calculate pagination metadata
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} totalCount - Total number of items
 * @returns {Object} Pagination metadata
 */
export function calculatePagination(page, limit, totalCount) {
  const currentPage = parseInt(page);
  const itemsPerPage = parseInt(limit);
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  
  return {
    currentPage,
    totalPages,
    totalCount,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
}

/**
 * Apply pagination to an array
 * @param {Array} items - Array of items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {Array} Paginated items array
 */
export function applyPagination(items, page, limit) {
  const skip = (parseInt(page) - 1) * parseInt(limit);
  return items.slice(skip, skip + parseInt(limit));
}

/**
 * Calculate category statistics from menu items
 * @param {Array} dishes - Array of menu items
 * @returns {Object} Category counts object
 */
export function calculateCategoryStats(dishes) {
  return dishes.reduce((acc, dish) => {
    acc[dish.category] = (acc[dish.category] || 0) + 1;
    return acc;
  }, {});
}