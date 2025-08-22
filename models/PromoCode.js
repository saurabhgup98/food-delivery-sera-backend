import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['birthday', 'promo'],
    required: true
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  minimumOrderAmount: {
    type: Number,
    required: true,
    min: 0
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  usedAt: {
    type: Date
  },
  expiresAt: {
    type: Date,
    required: true
  },
  maxUses: {
    type: Number,
    default: 1
  },
  currentUses: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
promoCodeSchema.index({ userId: 1, isUsed: 1 });
promoCodeSchema.index({ code: 1 }, { unique: true });
promoCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
promoCodeSchema.index({ type: 1, expiresAt: 1 });

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);

export default PromoCode;
