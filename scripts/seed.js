import connectDB from '../lib/mongodb.js';
import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';

const sampleRestaurants = [
  // BANGALORE RESTAURANTS
  {
    name: 'Chat Street - Authentic Street Food Hub',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    rating: 4.3,
    reviewCount: 892,
    cuisine: ['Street Food', 'Chats', 'Indian'],
    dietary: 'veg',
    deliveryTime: '20-35 min',
    deliveryFee: '₹25',
    minimumOrder: '₹150',
    distance: '1.5 km',
    popularDishes: ['Pani Puri', 'Bhel Puri', 'Dahi Puri', 'Samosa Chaat'],
    offers: ['10% off on orders above ₹300', 'Free delivery'],
    isOpen: true,
    isFavorite: false,
    priceRange: 'budget',
    features: ['Street food', 'Quick service', 'Traditional recipes'],
    status: 'OPEN',
    subStatus: 'BUSY',
    location: {
      address: 'Koramangala 8th Block',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560034'
    }
  },
  {
    name: 'Spice Garden - Traditional Indian Dining',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    rating: 4.5,
    reviewCount: 1247,
    cuisine: ['Indian', 'North Indian', 'Mughlai'],
    dietary: 'both',
    deliveryTime: '30-45 min',
    deliveryFee: '₹30',
    minimumOrder: '₹200',
    distance: '2.1 km',
    popularDishes: ['Butter Chicken', 'Paneer Tikka', 'Dal Makhani', 'Biryani'],
    offers: ['20% off on orders above ₹500', 'Free delivery'],
    isOpen: true,
    isFavorite: false,
    priceRange: 'mid-range',
    features: ['Pure veg available', 'Family restaurant', 'Fine dining'],
    status: 'OPEN',
    subStatus: 'NORMAL',
    location: {
      address: 'Indiranagar 100 Feet Road',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560038'
    }
  },
  {
    name: 'Pizza Palace - Artisanal Italian',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    rating: 4.4,
    reviewCount: 756,
    cuisine: ['Italian', 'Pizza', 'Pasta'],
    dietary: 'both',
    deliveryTime: '25-40 min',
    deliveryFee: '₹40',
    minimumOrder: '₹300',
    distance: '1.8 km',
    popularDishes: ['Margherita Pizza', 'Pepperoni Pizza', 'BBQ Chicken Pizza', 'Garlic Bread'],
    offers: ['Buy 1 Get 1 Free on Pizzas'],
    isOpen: true,
    isFavorite: true,
    priceRange: 'mid-range',
    features: ['Wood-fired oven', 'Fresh ingredients'],
    status: 'OPEN',
    subStatus: 'BUSY',
    location: {
      address: 'Whitefield Main Road',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560066'
    }
  },
  {
    name: 'Golden Dragon - Authentic Chinese',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    rating: 4.2,
    reviewCount: 634,
    cuisine: ['Chinese', 'Asian'],
    dietary: 'both',
    deliveryTime: '35-50 min',
    deliveryFee: '₹35',
    minimumOrder: '₹250',
    distance: '3.2 km',
    popularDishes: ['Kung Pao Chicken', 'Sweet and Sour Fish', 'Dim Sum', 'Spring Rolls'],
    offers: ['Free delivery on orders above ₹400'],
    isOpen: true,
    isFavorite: false,
    priceRange: 'mid-range',
    features: ['Authentic Chinese', 'Spicy options'],
    status: 'OPEN',
    subStatus: 'VERY_BUSY',
    location: {
      address: 'MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001'
    }
  },
  {
    name: 'Fusion Bites - Multi-Cuisine Delight',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
    rating: 4.1,
    reviewCount: 445,
    cuisine: ['Multi-cuisine', 'Fusion', 'International'],
    dietary: 'both',
    deliveryTime: '40-55 min',
    deliveryFee: '₹45',
    minimumOrder: '₹350',
    distance: '4.1 km',
    popularDishes: ['Indo-Chinese Noodles', 'Mexican Tacos', 'Thai Green Curry', 'American Burger'],
    offers: ['15% off for first order'],
    isOpen: true,
    isFavorite: false,
    priceRange: 'mid-range',
    features: ['Multi-cuisine', 'Fusion dishes'],
    status: 'OPEN',
    subStatus: 'NORMAL',
    location: {
      address: 'Electronic City Phase 1',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560100'
    }
  },
  // MUMBAI RESTAURANTS
  {
    name: 'Mumbai Chaat Corner - Street Food Paradise',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    rating: 4.4,
    reviewCount: 1123,
    cuisine: ['Street Food', 'Chats', 'Indian'],
    dietary: 'veg',
    deliveryTime: '15-30 min',
    deliveryFee: '₹20',
    minimumOrder: '₹100',
    distance: '0.8 km',
    popularDishes: ['Vada Pav', 'Bhel Puri', 'Sev Puri', 'Dahi Puri'],
    offers: ['5% off on orders above ₹200'],
    isOpen: true,
    isFavorite: false,
    priceRange: 'budget',
    features: ['Street food', 'Quick service', 'Mumbai special'],
    status: 'OPEN',
    subStatus: 'VERY_BUSY',
    location: {
      address: 'Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400050'
    }
  },
  {
    name: 'Royal Darbar - Luxury Indian Dining',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    rating: 4.6,
    reviewCount: 892,
    cuisine: ['Indian', 'North Indian', 'Mughlai'],
    dietary: 'both',
    deliveryTime: '45-60 min',
    deliveryFee: '₹60',
    minimumOrder: '₹500',
    distance: '2.5 km',
    popularDishes: ['Butter Chicken', 'Rogan Josh', 'Paneer Butter Masala', 'Biryani'],
    offers: ['25% off on orders above ₹800'],
    isOpen: true,
    isFavorite: true,
    priceRange: 'premium',
    features: ['Fine dining', 'Royal experience', 'Authentic recipes'],
    status: 'OPEN',
    subStatus: 'NORMAL',
    location: {
      address: 'Colaba Causeway',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001'
    }
  },
  {
    name: 'Pizza Express - Neapolitan Style',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    rating: 4.3,
    reviewCount: 678,
    cuisine: ['Italian', 'Pizza', 'Pasta'],
    dietary: 'both',
    deliveryTime: '30-45 min',
    deliveryFee: '₹50',
    minimumOrder: '₹400',
    distance: '1.9 km',
    popularDishes: ['Margherita Pizza', 'Quattro Stagioni', 'Diavola Pizza', 'Caprese Salad'],
    offers: ['Buy 1 Get 1 Free on Pizzas'],
    isOpen: true,
    isFavorite: false,
    priceRange: 'mid-range',
    features: ['Neapolitan style', 'Wood-fired oven'],
    status: 'OPEN',
    subStatus: 'BUSY',
    location: {
      address: 'Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400058'
    }
  },
  {
    name: 'Dragon Wok - Modern Chinese',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    rating: 4.2,
    reviewCount: 567,
    cuisine: ['Chinese', 'Asian'],
    dietary: 'both',
    deliveryTime: '35-50 min',
    deliveryFee: '₹40',
    minimumOrder: '₹300',
    distance: '2.8 km',
    popularDishes: ['General Tso\'s Chicken', 'Honey Garlic Fish', 'Dim Sum Platter', 'Spring Rolls'],
    offers: ['Free delivery on orders above ₹500'],
    isOpen: true,
    isFavorite: false,
    priceRange: 'mid-range',
    features: ['Modern Chinese', 'Contemporary dishes'],
    status: 'OPEN',
    subStatus: 'NORMAL',
    location: {
      address: 'Powai',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400076'
    }
  },
  {
    name: 'Global Kitchen - World Cuisine',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
    rating: 4.0,
    reviewCount: 445,
    cuisine: ['Multi-cuisine', 'International', 'Fusion'],
    dietary: 'both',
    deliveryTime: '50-65 min',
    deliveryFee: '₹55',
    minimumOrder: '₹450',
    distance: '3.5 km',
    popularDishes: ['Thai Green Curry', 'Mexican Enchiladas', 'American BBQ Ribs', 'Japanese Ramen'],
    offers: ['20% off for first order'],
    isOpen: true,
    isFavorite: false,
    priceRange: 'mid-range',
    features: ['World cuisine', 'International flavors'],
    status: 'OPEN',
    subStatus: 'NORMAL',
    location: {
      address: 'Worli',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400018'
    }
  }
];

const sampleMenuItems = [
  // Chat Street - Bangalore (Street Food)
  {
    restaurantId: null, // Will be set after restaurant creation
    name: 'Pani Puri',
    description: 'Crispy puris filled with tangy tamarind water and spicy potato mixture',
    price: '₹60',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    category: 'starters',
    dietary: 'veg',
    spiceLevel: 'medium',
    prepTime: '5 min',
    calories: '120 cal',
    rating: 4.5,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: true
  },
  {
    restaurantId: null,
    name: 'Bhel Puri',
    description: 'Puffed rice mixed with chutneys, vegetables, and crunchy sev',
    price: '₹80',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    category: 'starters',
    dietary: 'veg',
    spiceLevel: 'medium',
    prepTime: '8 min',
    calories: '180 cal',
    rating: 4.3,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Dahi Puri',
    description: 'Puris filled with yogurt, chutneys, and sweet tamarind sauce',
    price: '₹90',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    category: 'starters',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '10 min',
    calories: '220 cal',
    rating: 4.4,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Samosa Chaat',
    description: 'Crushed samosa topped with yogurt, chutneys, and spices',
    price: '₹100',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    category: 'starters',
    dietary: 'veg',
    spiceLevel: 'medium',
    prepTime: '12 min',
    calories: '280 cal',
    rating: 4.6,
    isPopular: true,
    isChefSpecial: true,
    isQuickOrder: false,
    isTrending: true
  },
  {
    restaurantId: null,
    name: 'Pav Bhaji',
    description: 'Spiced vegetable curry served with soft bread rolls',
    price: '₹120',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'veg',
    spiceLevel: 'medium',
    prepTime: '15 min',
    calories: '320 cal',
    rating: 4.2,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Vada Pav',
    description: 'Spicy potato fritter sandwiched in soft bread with chutneys',
    price: '₹70',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'veg',
    spiceLevel: 'medium',
    prepTime: '8 min',
    calories: '250 cal',
    rating: 4.1,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potato mixture',
    price: '₹110',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '12 min',
    calories: '280 cal',
    rating: 4.3,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Chole Bhature',
    description: 'Spicy chickpea curry served with deep-fried bread',
    price: '₹130',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'veg',
    spiceLevel: 'medium',
    prepTime: '18 min',
    calories: '420 cal',
    rating: 4.4,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: false,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Jalebi',
    description: 'Sweet fried dessert soaked in sugar syrup',
    price: '₹80',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    category: 'desserts',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '5 min',
    calories: '180 cal',
    rating: 4.5,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Lassi',
    description: 'Sweet yogurt drink with cardamom and saffron',
    price: '₹60',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    category: 'beverages',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '3 min',
    calories: '120 cal',
    rating: 4.2,
    isPopular: false,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },

  // Spice Garden - Bangalore (Traditional Indian)
  {
    restaurantId: null,
    name: 'Butter Chicken',
    description: 'Tender chicken cooked in rich, creamy tomato-based gravy with butter and cream',
    price: '₹450',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'non-veg',
    spiceLevel: 'medium',
    prepTime: '25 min',
    calories: '450 cal',
    rating: 4.8,
    isPopular: true,
    isChefSpecial: true,
    isQuickOrder: false,
    isTrending: true
  },
  {
    restaurantId: null,
    name: 'Paneer Tikka',
    description: 'Marinated cottage cheese grilled to perfection with Indian spices',
    price: '₹380',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
    category: 'starters',
    dietary: 'veg',
    spiceLevel: 'medium',
    prepTime: '20 min',
    calories: '280 cal',
    rating: 4.5,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Dal Makhani',
    description: 'Creamy black lentils slow-cooked with butter and cream',
    price: '₹280',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '30 min',
    calories: '320 cal',
    rating: 4.3,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: false,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Naan',
    description: 'Soft and fluffy Indian bread baked in tandoor',
    price: '₹60',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
    category: 'breads',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '10 min',
    calories: '120 cal',
    rating: 4.2,
    isPopular: false,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Biryani',
    description: 'Fragrant basmati rice cooked with aromatic spices and tender meat',
    price: '₹520',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d4a9?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'non-veg',
    spiceLevel: 'hot',
    prepTime: '30 min',
    calories: '550 cal',
    rating: 4.7,
    isPopular: true,
    isChefSpecial: true,
    isQuickOrder: false,
    isTrending: true
  },
  {
    restaurantId: null,
    name: 'Tandoori Roti',
    description: 'Whole wheat bread baked in tandoor',
    price: '₹40',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
    category: 'breads',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '8 min',
    calories: '100 cal',
    rating: 4.1,
    isPopular: false,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Chicken Tikka',
    description: 'Grilled chicken pieces marinated in yogurt and spices',
    price: '₹420',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
    category: 'starters',
    dietary: 'non-veg',
    spiceLevel: 'medium',
    prepTime: '22 min',
    calories: '320 cal',
    rating: 4.4,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Palak Paneer',
    description: 'Cottage cheese in creamy spinach gravy',
    price: '₹320',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '20 min',
    calories: '280 cal',
    rating: 4.2,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Gulab Jamun',
    description: 'Sweet, soft milk solids balls soaked in sugar syrup',
    price: '₹120',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
    category: 'desserts',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '5 min',
    calories: '200 cal',
    rating: 4.6,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Mango Lassi',
    description: 'Sweet mango yogurt drink',
    price: '₹100',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    category: 'beverages',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '3 min',
    calories: '150 cal',
    rating: 4.3,
    isPopular: false,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },

  // Pizza Palace - Bangalore (Italian)
  {
    restaurantId: null,
    name: 'Margherita Pizza',
    description: 'Classic tomato sauce with mozzarella cheese and fresh basil',
    price: '₹350',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '20 min',
    calories: '280 cal',
    rating: 4.5,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: true
  },
  {
    restaurantId: null,
    name: 'Pepperoni Pizza',
    description: 'Spicy pepperoni with mozzarella cheese and tomato sauce',
    price: '₹420',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'non-veg',
    spiceLevel: 'medium',
    prepTime: '22 min',
    calories: '320 cal',
    rating: 4.6,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: true
  },
  {
    restaurantId: null,
    name: 'BBQ Chicken Pizza',
    description: 'BBQ sauce with grilled chicken and red onions',
    price: '₹450',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'non-veg',
    spiceLevel: 'medium',
    prepTime: '25 min',
    calories: '380 cal',
    rating: 4.4,
    isPopular: true,
    isChefSpecial: true,
    isQuickOrder: false,
    isTrending: true
  },
  {
    restaurantId: null,
    name: 'Four Cheese Pizza',
    description: 'Blend of four different cheeses with tomato sauce',
    price: '₹400',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '20 min',
    calories: '350 cal',
    rating: 4.3,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Garlic Bread',
    description: 'Toasted bread with garlic butter and herbs',
    price: '₹120',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    category: 'starters',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '8 min',
    calories: '180 cal',
    rating: 4.2,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Pasta Carbonara',
    description: 'Creamy pasta with bacon, eggs, and parmesan cheese',
    price: '₹320',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'non-veg',
    spiceLevel: 'mild',
    prepTime: '18 min',
    calories: '420 cal',
    rating: 4.4,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Tiramisu',
    description: 'Coffee-flavored Italian dessert with mascarpone cream',
    price: '₹180',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    category: 'desserts',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '5 min',
    calories: '280 cal',
    rating: 4.7,
    isPopular: true,
    isChefSpecial: true,
    isQuickOrder: true,
    isTrending: true
  },
  {
    restaurantId: null,
    name: 'Bruschetta',
    description: 'Toasted bread topped with tomatoes, garlic, and olive oil',
    price: '₹140',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    category: 'starters',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '10 min',
    calories: '160 cal',
    rating: 4.1,
    isPopular: false,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Italian Soda',
    description: 'Refreshing carbonated drink with flavored syrup',
    price: '₹80',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    category: 'beverages',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '3 min',
    calories: '120 cal',
    rating: 4.0,
    isPopular: false,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Caesar Salad',
    description: 'Fresh lettuce with caesar dressing and croutons',
    price: '₹200',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    category: 'starters',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '12 min',
    calories: '180 cal',
    rating: 4.2,
    isPopular: false,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },

  // Golden Dragon - Bangalore (Chinese)
  {
    restaurantId: null,
    name: 'Kung Pao Chicken',
    description: 'Spicy diced chicken with peanuts and vegetables in chili sauce',
    price: '₹420',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'non-veg',
    spiceLevel: 'hot',
    prepTime: '30 min',
    calories: '380 cal',
    rating: 4.4,
    isPopular: true,
    isChefSpecial: true,
    isQuickOrder: false,
    isTrending: true
  },
  {
    restaurantId: null,
    name: 'Sweet and Sour Fish',
    description: 'Crispy fish in tangy sweet and sour sauce',
    price: '₹380',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'non-veg',
    spiceLevel: 'mild',
    prepTime: '25 min',
    calories: '320 cal',
    rating: 4.2,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Vegetable Fried Rice',
    description: 'Stir-fried rice with mixed vegetables and soy sauce',
    price: '₹180',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '15 min',
    calories: '280 cal',
    rating: 4.1,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Chicken Noodles',
    description: 'Stir-fried noodles with chicken and vegetables',
    price: '₹220',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'non-veg',
    spiceLevel: 'medium',
    prepTime: '18 min',
    calories: '320 cal',
    rating: 4.3,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Dim Sum',
    description: 'Steamed dumplings filled with vegetables and meat',
    price: '₹280',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    category: 'starters',
    dietary: 'non-veg',
    spiceLevel: 'mild',
    prepTime: '20 min',
    calories: '240 cal',
    rating: 4.5,
    isPopular: true,
    isChefSpecial: true,
    isQuickOrder: false,
    isTrending: true
  },
  {
    restaurantId: null,
    name: 'Hot and Sour Soup',
    description: 'Spicy and sour soup with vegetables and tofu',
    price: '₹160',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    category: 'starters',
    dietary: 'veg',
    spiceLevel: 'hot',
    prepTime: '12 min',
    calories: '120 cal',
    rating: 4.2,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Mapo Tofu',
    description: 'Spicy tofu with minced meat in chili sauce',
    price: '₹320',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'non-veg',
    spiceLevel: 'hot',
    prepTime: '22 min',
    calories: '280 cal',
    rating: 4.3,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Spring Rolls',
    description: 'Crispy vegetable rolls with sweet chili sauce',
    price: '₹200',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    category: 'starters',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '15 min',
    calories: '180 cal',
    rating: 4.1,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Fortune Cookies',
    description: 'Sweet cookies with fortune messages inside',
    price: '₹60',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    category: 'desserts',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '3 min',
    calories: '80 cal',
    rating: 4.0,
    isPopular: false,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Green Tea',
    description: 'Traditional Chinese green tea',
    price: '₹40',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    category: 'beverages',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '2 min',
    calories: '5 cal',
    rating: 4.1,
    isPopular: false,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },

  // Fusion Bites - Bangalore (Multi-cuisine)
  {
    restaurantId: null,
    name: 'Indo-Chinese Noodles',
    description: 'Indian-style Chinese noodles with vegetables and spices',
    price: '₹240',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'veg',
    spiceLevel: 'medium',
    prepTime: '20 min',
    calories: '320 cal',
    rating: 4.3,
    isPopular: true,
    isChefSpecial: true,
    isQuickOrder: true,
    isTrending: true
  },
  {
    restaurantId: null,
    name: 'Mexican Tacos',
    description: 'Soft tacos with grilled vegetables and salsa',
    price: '₹280',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'veg',
    spiceLevel: 'medium',
    prepTime: '18 min',
    calories: '280 cal',
    rating: 4.2,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Mediterranean Salad',
    description: 'Fresh salad with olives, feta cheese, and olive oil',
    price: '₹220',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
    category: 'starters',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '12 min',
    calories: '180 cal',
    rating: 4.1,
    isPopular: false,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Thai Green Curry',
    description: 'Spicy coconut curry with vegetables and herbs',
    price: '₹360',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'veg',
    spiceLevel: 'hot',
    prepTime: '25 min',
    calories: '320 cal',
    rating: 4.4,
    isPopular: true,
    isChefSpecial: true,
    isQuickOrder: false,
    isTrending: true
  },
  {
    restaurantId: null,
    name: 'American Burger',
    description: 'Classic beef burger with lettuce, tomato, and cheese',
    price: '₹320',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'non-veg',
    spiceLevel: 'mild',
    prepTime: '15 min',
    calories: '450 cal',
    rating: 4.3,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Japanese Sushi',
    description: 'Fresh fish and rice rolls with wasabi and soy sauce',
    price: '₹400',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
    category: 'starters',
    dietary: 'non-veg',
    spiceLevel: 'mild',
    prepTime: '20 min',
    calories: '280 cal',
    rating: 4.5,
    isPopular: true,
    isChefSpecial: true,
    isQuickOrder: false,
    isTrending: true
  },
  {
    restaurantId: null,
    name: 'Italian Risotto',
    description: 'Creamy rice dish with mushrooms and parmesan',
    price: '₹340',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '30 min',
    calories: '380 cal',
    rating: 4.2,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: false,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Lebanese Shawarma',
    description: 'Wrapped meat with vegetables and tahini sauce',
    price: '₹260',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'non-veg',
    spiceLevel: 'medium',
    prepTime: '12 min',
    calories: '320 cal',
    rating: 4.1,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'French Croissant',
    description: 'Buttery flaky pastry with chocolate filling',
    price: '₹120',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
    category: 'desserts',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '5 min',
    calories: '220 cal',
    rating: 4.3,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Indian Masala Chai',
    description: 'Spiced tea with milk and cardamom',
    price: '₹60',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
    category: 'beverages',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '5 min',
    calories: '80 cal',
    rating: 4.2,
    isPopular: false,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    console.log('Clearing existing data...');
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    
    console.log('Creating restaurants...');
    const createdRestaurants = await Restaurant.insertMany(sampleRestaurants);
    
    console.log('Creating menu items...');
    
    // Create menu items for each restaurant
    const allMenuItems = [];
    
    // Chat Street - Bangalore (10 items)
    for (let i = 0; i < 10; i++) {
      allMenuItems.push({
        ...sampleMenuItems[i],
        restaurantId: createdRestaurants[0]._id
      });
    }
    
    // Spice Garden - Bangalore (10 items)
    for (let i = 10; i < 20; i++) {
      allMenuItems.push({
        ...sampleMenuItems[i],
        restaurantId: createdRestaurants[1]._id
      });
    }
    
    // Pizza Palace - Bangalore (10 items)
    for (let i = 20; i < 30; i++) {
      allMenuItems.push({
        ...sampleMenuItems[i],
        restaurantId: createdRestaurants[2]._id
      });
    }
    
    // Golden Dragon - Bangalore (10 items)
    for (let i = 30; i < 40; i++) {
      allMenuItems.push({
        ...sampleMenuItems[i],
        restaurantId: createdRestaurants[3]._id
      });
    }
    
    // Fusion Bites - Bangalore (10 items)
    for (let i = 40; i < 50; i++) {
      allMenuItems.push({
        ...sampleMenuItems[i],
        restaurantId: createdRestaurants[4]._id
      });
    }
    
    // Mumbai Chaat Corner - Mumbai (10 items - reuse Chat Street items)
    for (let i = 0; i < 10; i++) {
      allMenuItems.push({
        ...sampleMenuItems[i],
        restaurantId: createdRestaurants[5]._id
      });
    }
    
    // Royal Darbar - Mumbai (10 items - reuse Spice Garden items)
    for (let i = 10; i < 20; i++) {
      allMenuItems.push({
        ...sampleMenuItems[i],
        restaurantId: createdRestaurants[6]._id
      });
    }
    
    // Pizza Express - Mumbai (10 items - reuse Pizza Palace items)
    for (let i = 20; i < 30; i++) {
      allMenuItems.push({
        ...sampleMenuItems[i],
        restaurantId: createdRestaurants[7]._id
      });
    }
    
    // Dragon Wok - Mumbai (10 items - reuse Golden Dragon items)
    for (let i = 30; i < 40; i++) {
      allMenuItems.push({
        ...sampleMenuItems[i],
        restaurantId: createdRestaurants[8]._id
      });
    }
    
    // Global Kitchen - Mumbai (10 items - reuse Fusion Bites items)
    for (let i = 40; i < 50; i++) {
      allMenuItems.push({
        ...sampleMenuItems[i],
        restaurantId: createdRestaurants[9]._id
      });
    }
    
    await MenuItem.insertMany(allMenuItems);
    
    console.log('Database seeded successfully!');
    console.log(`Created ${createdRestaurants.length} restaurants`);
    console.log(`Created ${allMenuItems.length} menu items`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
