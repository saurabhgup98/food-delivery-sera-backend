import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['security', 'registration', 'review', 'promo', 'birthday'],
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  action: {
    type: String,
    enum: ['none', 'rate', 'use_code', 'view_order'],
    default: 'none'
  },
  orderId: {
    type: String
  },
  promoCode: {
    type: String
  },
  expiresAt: {
    type: Date
  },
  sentEmail: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
