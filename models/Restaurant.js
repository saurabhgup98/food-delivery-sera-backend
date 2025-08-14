import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    maxlength: [100, 'Restaurant name cannot be more than 100 characters']
  },
  image: {
    type: String,
    required: [true, 'Restaurant image is required']
  },
  rating: {
    type: Number,
    required: true,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  reviewCount: {
    type: Number,
    required: true,
    min: [0, 'Review count cannot be negative'],
    default: 0
  },
  cuisine: [{
    type: String,
    required: true
  }],
  dietary: {
    type: String,
    enum: ['veg', 'non-veg', 'both', 'jain', 'vegan'],
    required: true,
    default: 'both'
  },
  deliveryTime: {
    type: String,
    required: true,
    default: '30-45 min'
  },
  deliveryFee: {
    type: String,
    required: true,
    default: '₹30'
  },
  minimumOrder: {
    type: String,
    required: true,
    default: '₹200'
  },
  distance: {
    type: String,
    required: true,
    default: '2.1 km'
  },
  popularDishes: [{
    type: String
  }],
  offers: [{
    type: String
  }],
  isOpen: {
    type: Boolean,
    default: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  priceRange: {
    type: String,
    enum: ['budget', 'mid-range', 'premium'],
    required: true,
    default: 'mid-range'
  },
  features: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['OPEN', 'CLOSED', 'TEMPORARILY_CLOSED', 'PERMANENTLY_CLOSED'],
    required: true,
    default: 'OPEN'
  },
  subStatus: {
    type: String,
    enum: ['NORMAL', 'BUSY', 'VERY_BUSY'],
    default: 'NORMAL'
  },
  statusDetails: {
    nextOpenTime: String,
    tempCloseReason: String,
    tempCloseDuration: String
  },
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
restaurantSchema.index({ status: 1, isActive: 1 });
restaurantSchema.index({ cuisine: 1 });
restaurantSchema.index({ dietary: 1 });

export default mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);
