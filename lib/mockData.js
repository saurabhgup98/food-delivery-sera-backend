/**
 * Mock data for restaurant endpoints
 * Used when request is from localhost/local network and DB is not connected
 */

/**
 * Get list of mock restaurants
 * @returns {Array} Array of mock restaurant objects
 */
export function getMockRestaurants() {
  return [
    getMockRestaurant('1'),
    getMockRestaurant('2'),
    getMockRestaurant('3')
  ];
}

/**
 * Generate mock restaurant data based on restaurant ID
 * @param {string} restaurantId - Restaurant ID
 * @returns {Object} Mock restaurant object
 */
export function getMockRestaurant(restaurantId) {
  const isOpenRestaurant = !restaurantId?.toString().toLowerCase().includes('closed');
  
  return {
    _id: restaurantId,
    name: isOpenRestaurant ? 'Spice Garden - OPEN' : 'Royal Palace - CLOSED',
    image: isOpenRestaurant
      ? 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
      : 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    cuisine: ['Indian', 'North Indian'],
    rating: 4.5,
    reviewCount: 1250,
    deliveryTime: '25-30 min',
    distance: '2.5 km',
    minimumOrder: '₹150',
    deliveryFee: '₹30',
    status: isOpenRestaurant ? 'OPEN' : 'CLOSED',
    subStatus: isOpenRestaurant ? 'NORMAL' : undefined,
    isFavorite: false,
    isOpen: isOpenRestaurant,
    offers: isOpenRestaurant
      ? ['20% off on first order', 'Free delivery above ₹300']
      : [],
    popularDishes: ['Butter Chicken', 'Dal Makhani', 'Biryani'],
    dietary: 'both',
    priceRange: 'mid-range',
    features: ['Fast Delivery', 'Vegetarian Options', 'Free Delivery'],
    statusDetails: isOpenRestaurant ? {} : {
      nextOpenTime: 'Tomorrow at 11:00 AM',
      tempCloseReason: 'Renovation in progress',
      tempCloseDuration: '2 weeks'
    },
    dishes: getMockMenuItems(restaurantId)
  };
}

/**
 * Generate mock menu items for a restaurant
 * @param {string} restaurantId - Restaurant ID
 * @returns {Array} Array of mock menu item objects
 */
export function getMockMenuItems(restaurantId) {
  const isOpenRestaurant = !restaurantId?.toString().toLowerCase().includes('closed');
  
  return [
    {
      _id: '1',
      restaurantId,
      name: 'Butter Chicken',
      description: 'Creamy tomato-based curry with tender chicken pieces',
      price: '₹320',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
      category: 'mains',
      dietary: 'non-veg',
      spiceLevel: 'medium',
      prepTime: '25 min',
      calories: '450 cal',
      rating: 4.5,
      isPopular: true,
      isChefSpecial: false,
      isQuickOrder: true,
      isTrending: true,
      isAvailable: isOpenRestaurant,
      customizationOptions: {
        sizes: [
          { name: 'Regular', price: '₹320' },
          { name: 'Large', price: '₹450' }
        ],
        spiceLevels: [
          { name: 'Mild', price: '₹0' },
          { name: 'Medium', price: '₹0' },
          { name: 'Hot', price: '₹0' }
        ]
      }
    },
    {
      _id: '2',
      restaurantId,
      name: 'Dal Makhani',
      description: 'Rich and creamy black lentils cooked with butter and cream',
      price: '₹280',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
      category: 'mains',
      dietary: 'veg',
      prepTime: '30 min',
      calories: '380 cal',
      rating: 4.3,
      isPopular: true,
      isChefSpecial: true,
      isQuickOrder: false,
      isTrending: false,
      isAvailable: isOpenRestaurant
    },
    {
      _id: '3',
      restaurantId,
      name: 'Biryani',
      description: 'Fragrant basmati rice with aromatic spices and tender meat',
      price: '₹350',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
      category: 'mains',
      dietary: 'non-veg',
      spiceLevel: 'hot',
      prepTime: '35 min',
      calories: '520 cal',
      rating: 4.7,
      isPopular: true,
      isChefSpecial: true,
      isQuickOrder: false,
      isTrending: true,
      isAvailable: isOpenRestaurant
    },
    {
      _id: '4',
      restaurantId,
      name: 'Paneer Tikka',
      description: 'Grilled cottage cheese marinated in spices',
      price: '₹250',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
      category: 'starters',
      dietary: 'veg',
      spiceLevel: 'medium',
      prepTime: '20 min',
      calories: '320 cal',
      rating: 4.4,
      isPopular: true,
      isChefSpecial: false,
      isQuickOrder: true,
      isTrending: false,
      isAvailable: isOpenRestaurant
    },
    {
      _id: '5',
      restaurantId,
      name: 'Gulab Jamun',
      description: 'Sweet milk dumplings in rose-flavored syrup',
      price: '₹120',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
      category: 'desserts',
      dietary: 'veg',
      prepTime: '10 min',
      calories: '280 cal',
      rating: 4.6,
      isPopular: true,
      isChefSpecial: false,
      isQuickOrder: true,
      isTrending: true,
      isAvailable: isOpenRestaurant
    }
  ];
}

