import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant ID is required']
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [100, 'Item name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Item description is required'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: String,
    required: [true, 'Item price is required']
  },
  image: {
    type: String,
    required: [true, 'Item image is required']
  },
  category: {
    type: String,
    enum: ['starters', 'mains', 'breads', 'desserts', 'beverages'],
    required: [true, 'Item category is required']
  },
  dietary: {
    type: String,
    enum: ['veg', 'non-veg', 'jain', 'vegan'],
    required: [true, 'Dietary type is required']
  },
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'hot', 'extra-hot'],
    default: 'medium'
  },
  prepTime: {
    type: String,
    required: true,
    default: '20 min'
  },
  calories: {
    type: String
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 4.0
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isChefSpecial: {
    type: Boolean,
    default: false
  },
  isQuickOrder: {
    type: Boolean,
    default: false
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  customizationOptions: {
    sizes: [{
      name: String,
      price: String
    }],
    spiceLevels: [{
      name: String,
      price: String
    }],
    addOns: [{
      name: String,
      price: String
    }]
  }
}, {
  timestamps: true
});

// Index for better query performance
menuItemSchema.index({ restaurantId: 1, category: 1 });
menuItemSchema.index({ restaurantId: 1, isAvailable: 1 });
menuItemSchema.index({ isPopular: 1 });
menuItemSchema.index({ isChefSpecial: 1 });
menuItemSchema.index({ isQuickOrder: 1 });
menuItemSchema.index({ isTrending: 1 });

export default mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);
