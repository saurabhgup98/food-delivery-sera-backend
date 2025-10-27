import { Request } from 'express';

// User Types (comprehensive for food delivery app)
export interface IUser {
  _id: string;
  email: string; // Primary bridge key from simple-auth
  authUserId: string; // Reference to simple-auth user ID
  personalDetails: IPersonalDetails;
  addresses: IAddress[];
  foodPreferences: IFoodPreferences;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPersonalDetails {
  fullName: string;
  phone: string;
  countryCode: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
}

export interface IAddress {
  _id: string;
  addressType: 'Home' | 'Work' | 'Other';
  fullName: string;
  phone: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  deliveryInstructions?: string;
  isDefault: boolean;
}

export interface IFoodPreferences {
  dietaryPreferences: ('vegetarian' | 'vegan' | 'jain' | 'halal' | 'kosher' | 'gluten-free' | 'dairy-free' | 'nut-free')[];
  allergies: {
    fixed: ('nuts' | 'dairy' | 'gluten' | 'seafood' | 'eggs')[];
    custom: string[];
  };
  spiceLevel: 'mild' | 'medium' | 'hot' | 'extra-hot';
  caloriePreference: 'low' | 'moderate' | 'high';
  preferredCuisines: ('indian' | 'chinese' | 'italian' | 'mexican' | 'thai' | 'japanese' | 'mediterranean' | 'american')[];
}

// Restaurant Types
export interface IRestaurant {
  _id: string;
  name: string;
  description: string;
  image: string;
  banner?: string;
  rating: number;
  reviewCount: number;
  cuisine: string[];
  dietary: 'veg' | 'non-veg' | 'both' | 'jain' | 'vegan';
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  distance: number;
  popularDishes: string[];
  offers: string[];
  isOpen: boolean;
  isFavorite: boolean;
  priceRange: 'budget' | 'mid-range' | 'premium';
  features: string[];
  status: 'OPEN' | 'CLOSED' | 'BUSY';
  subStatus: 'NORMAL' | 'BUSY' | 'CLOSED_FOR_TODAY';
  statusDetails?: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Menu Types
export interface IMenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  restaurantId: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isJain: boolean;
  spiceLevel: 'mild' | 'medium' | 'hot';
  allergens: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  customization: {
    sizes: ISizeOption[];
    toppings: IToppingOption[];
    extras: IExtraOption[];
    spiceLevels: ISpiceLevel[];
    cookingStyles: ICookingStyle[];
  };
  isAvailable: boolean;
  preparationTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISizeOption {
  name: string;
  price: number;
  isDefault: boolean;
}

export interface IToppingOption {
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface IExtraOption {
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface ISpiceLevel {
  name: string;
  level: number;
  isDefault: boolean;
}

export interface ICookingStyle {
  name: string;
  additionalTime: number;
  isAvailable: boolean;
}

// Order Types
export interface IOrder {
  _id: string;
  userId: string;
  restaurantId: string;
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'upi' | 'wallet';
  deliveryAddress: IAddress;
  specialInstructions?: string;
  estimatedDeliveryTime: Date;
  actualDeliveryTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  customization: {
    size?: string;
    toppings: string[];
    extras: string[];
    spiceLevel: string;
    cookingStyle?: string;
    specialInstructions?: string;
  };
  totalPrice: number;
}

// Cart Types
export interface ICartItem {
  menuItemId: string;
  restaurantId: string;
  quantity: number;
  customization: {
    size?: string;
    toppings: string[];
    extras: string[];
    spiceLevel: string;
    cookingStyle?: string;
    specialInstructions?: string;
  };
  price: number;
  totalPrice: number;
}

export interface ICart {
  userId: string;
  restaurantId?: string;
  items: ICartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  updatedAt: Date;
}

// Auth Types (simplified)
export interface IAuthRequest extends Request {
  user?: {
    _id: string;
    id: string;
  };
}

// API Response Types
export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | undefined;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Types
export interface IAppError extends Error {
  statusCode: number;
  isOperational: boolean;
  code?: string | number;
  keyValue?: Record<string, any>;
  errors?: Record<string, any>;
}

// JWT Payload (from simple-auth service)
export interface IJWTPayload {
  userId: string;
  iat: number;
  exp: number;
}
