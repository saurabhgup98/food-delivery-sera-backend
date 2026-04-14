import mongoose, { Document, Schema } from 'mongoose';

export interface IUserDocument extends Document {
  email: string;
  authUserId?: string;
  name?: string;
  phone?: string;
  avatar?: string;
  isActive?: boolean;
  lastLoginAt?: Date;
  metadata?: Record<string, any>;
}

const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    authUserId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });
userSchema.index({ authUserId: 1 });

const User = mongoose.model<IUserDocument>('User', userSchema);

export default User;