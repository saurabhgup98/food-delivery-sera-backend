import connectDB from '../lib/mongodb.js';
import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';

const sampleRestaurants = [
  {
    name: 'Spice Garden',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    rating: 4.5,
    reviewCount: 1247,
    cuisine: ['Indian', 'North Indian', 'Mughlai'],
    dietary: 'both',
    deliveryTime: '30-45 min',
    deliveryFee: '₹30',
    minimumOrder: '₹200',
    distance: '2.1 km',
    popularDishes: ['Butter Chicken', 'Biryani', 'Naan', 'Tandoori Chicken'],
    offers: ['20% off on orders above ₹500', 'Free delivery'],
    isOpen: true,
    isFavorite: false,
    priceRange: 'mid-range',
    features: ['Pure veg available', 'Family restaurant', 'Fine dining'],
    status: 'OPEN',
    subStatus: 'NORMAL'
  },
  {
    name: 'Pizza Palace',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    rating: 4.2,
    reviewCount: 892,
    cuisine: ['Italian', 'Pizza', 'Pasta'],
    dietary: 'both',
    deliveryTime: '25-40 min',
    deliveryFee: '₹40',
    minimumOrder: '₹300',
    distance: '1.8 km',
    popularDishes: ['Margherita Pizza', 'Pepperoni Pizza', 'Pasta Carbonara', 'Garlic Bread'],
    offers: ['Buy 1 Get 1 Free on Pizzas'],
    isOpen: true,
    isFavorite: true,
    priceRange: 'mid-range',
    features: ['Wood-fired oven', 'Fresh ingredients'],
    status: 'OPEN',
    subStatus: 'BUSY'
  },
  {
    name: 'Green Leaf',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 567,
    cuisine: ['Indian', 'South Indian', 'Vegetarian'],
    dietary: 'veg',
    deliveryTime: '20-35 min',
    deliveryFee: '₹20',
    minimumOrder: '₹150',
    distance: '1.2 km',
    popularDishes: ['Masala Dosa', 'Idli Sambar', 'Pongal', 'Filter Coffee'],
    offers: ['15% off for first order'],
    isOpen: true,
    isFavorite: false,
    priceRange: 'budget',
    features: ['Pure vegetarian', 'Traditional recipes'],
    status: 'OPEN',
    subStatus: 'NORMAL'
  },
  {
    name: 'Dragon Wok',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    rating: 4.3,
    reviewCount: 734,
    cuisine: ['Chinese', 'Asian', 'Fast Food'],
    dietary: 'both',
    deliveryTime: '35-50 min',
    deliveryFee: '₹35',
    minimumOrder: '₹250',
    distance: '3.2 km',
    popularDishes: ['Kung Pao Chicken', 'Sweet & Sour Pork', 'Fried Rice', 'Spring Rolls'],
    offers: ['Free delivery on orders above ₹400'],
    isOpen: true,
    isFavorite: false,
    priceRange: 'mid-range',
    features: ['Authentic Chinese', 'Spicy options'],
    status: 'OPEN',
    subStatus: 'VERY_BUSY'
  },
  {
    name: 'Burger House',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
    rating: 4.1,
    reviewCount: 445,
    cuisine: ['American', 'Fast Food', 'Burgers'],
    dietary: 'both',
    deliveryTime: '15-30 min',
    deliveryFee: '₹25',
    minimumOrder: '₹180',
    distance: '0.8 km',
    popularDishes: ['Classic Burger', 'Chicken Burger', 'French Fries', 'Milkshake'],
    offers: ['Combo deals available'],
    isOpen: false,
    isFavorite: false,
    priceRange: 'budget',
    features: ['Quick service', 'Family friendly'],
    status: 'CLOSED',
    subStatus: 'NORMAL',
    statusDetails: {
      nextOpenTime: 'tomorrow at 11:00 AM'
    }
  }
];

const sampleMenuItems = [
  // Spice Garden Menu Items
  {
    restaurantId: null, // Will be set after restaurant creation
    name: 'Butter Chicken',
    description: 'Tender chicken cooked in a rich, creamy tomato-based gravy with butter and cream',
    price: '₹280',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'non-veg',
    spiceLevel: 'medium',
    prepTime: '25 min',
    calories: '450 cal',
    rating: 4.8,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: true
  },
  {
    restaurantId: null,
    name: 'Biryani',
    description: 'Fragrant basmati rice cooked with aromatic spices and tender meat',
    price: '₹320',
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
    name: 'Paneer Tikka',
    description: 'Marinated cottage cheese grilled to perfection with Indian spices',
    price: '₹220',
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
    name: 'Naan',
    description: 'Soft and fluffy Indian bread baked in tandoor',
    price: '₹30',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
    category: 'breads',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '10 min',
    calories: '120 cal',
    rating: 4.3,
    isPopular: false,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false
  },
  {
    restaurantId: null,
    name: 'Gulab Jamun',
    description: 'Sweet, soft milk solids balls soaked in sugar syrup',
    price: '₹80',
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
    const menuItemsWithRestaurantIds = sampleMenuItems.map(item => ({
      ...item,
      restaurantId: createdRestaurants[0]._id // All items for Spice Garden
    }));
    
    await MenuItem.insertMany(menuItemsWithRestaurantIds);
    
    console.log('Database seeded successfully!');
    console.log(`Created ${createdRestaurants.length} restaurants`);
    console.log(`Created ${menuItemsWithRestaurantIds.length} menu items`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
