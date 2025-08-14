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
  }
];

const sampleMenuItems = [
  {
    name: 'Butter Chicken',
    description: 'Creamy and rich butter chicken with tender chicken pieces',
    price: '₹350',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'non-veg',
    spiceLevel: 'medium',
    prepTime: '25 min',
    calories: '450 kcal',
    rating: 4.8,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: true,
    isAvailable: true
  },
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: '₹400',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    category: 'mains',
    dietary: 'veg',
    spiceLevel: 'mild',
    prepTime: '20 min',
    calories: '380 kcal',
    rating: 4.5,
    isPopular: true,
    isChefSpecial: false,
    isQuickOrder: true,
    isTrending: false,
    isAvailable: true
  }
];

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
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }
  
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
    
    res.status(200).json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        restaurantsCreated: createdRestaurants.length,
        menuItemsCreated: menuItemsWithRestaurantIds.length
      }
    });
    
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding database',
      error: error.message
    });
  }
}
