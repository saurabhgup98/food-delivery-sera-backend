import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: false
  },
  targetRole: {
    type: String,
    enum: ['admin', 'restaurant_owner'],
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
activitySchema.index({ targetRole: 1, timestamp: -1 });
activitySchema.index({ restaurantId: 1, targetRole: 1, timestamp: -1 });
activitySchema.index({ userId: 1, timestamp: -1 });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
