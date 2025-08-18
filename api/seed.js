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
    restaurantId: null,
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
    const allMenuItems = [];
    
    // Create menu items for each restaurant (reusing the same items for simplicity)
    for (let restaurantIndex = 0; restaurantIndex < createdRestaurants.length; restaurantIndex++) {
      for (let itemIndex = 0; itemIndex < sampleMenuItems.length; itemIndex++) {
        allMenuItems.push({
          ...sampleMenuItems[itemIndex],
          restaurantId: createdRestaurants[restaurantIndex]._id
        });
      }
    }
    
    await MenuItem.insertMany(allMenuItems);
    
    console.log('Database seeded successfully!');
    console.log(`Created ${createdRestaurants.length} restaurants`);
    console.log(`Created ${allMenuItems.length} menu items`);
    
    return {
      success: true,
      restaurants: createdRestaurants.length,
      menuItems: allMenuItems.length
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Allow both GET and POST for easier access
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const result = await seedDatabase();
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Database seeded successfully!',
        data: {
          restaurants: result.restaurants,
          menuItems: result.menuItems
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to seed database',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Seed API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
