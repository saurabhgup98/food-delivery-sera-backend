import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IApiResponse, ILoginRequest, IRegisterRequest, IAppError } from '../types/index.js';
import User from '../models/User.js';

// Generate JWT Token
const generateToken = (userId: string): string => {
  const secret = process.env['JWT_SECRET'] || 'fallback-secret';
  
  return jwt.sign(
    { userId },
    secret,
    { expiresIn: '7d' }
  );
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, phone }: IRegisterRequest = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error: IAppError = new Error('User already exists with this email') as IAppError;
      error.statusCode = 400;
      return next(error);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      isVerified: true, // For now, auto-verify users
    });

    // Generate token
    const token = generateToken(user._id.toString());

    const response: IApiResponse = {
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
          avatar: user.avatar,
        },
        token,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password }: ILoginRequest = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const error: IAppError = new Error('Invalid credentials') as IAppError;
      error.statusCode = 401;
      return next(error);
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      const error: IAppError = new Error('Invalid credentials') as IAppError;
      error.statusCode = 401;
      return next(error);
    }

    // Check if user is verified
    if (!user.isVerified) {
      const error: IAppError = new Error('Please verify your email first') as IAppError;
      error.statusCode = 401;
      return next(error);
    }

    // Generate token
    const token = generateToken(user._id.toString());

    const response: IApiResponse = {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
          avatar: user.avatar,
        },
        token,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById((req as any).user._id);

    const response: IApiResponse = {
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        user,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const response: IApiResponse = {
      success: true,
      message: 'Logged out successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, phone, avatar } = req.body;
    const userId = (req as any).user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        phone,
        avatar,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      const error: IAppError = new Error('User not found') as IAppError;
      error.statusCode = 404;
      return next(error);
    }

    const response: IApiResponse = {
      success: true,
      message: 'Profile updated successfully',
      data: {
        user,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).user._id;

    const user = await User.findById(userId).select('+password');
    if (!user) {
      const error: IAppError = new Error('User not found') as IAppError;
      error.statusCode = 404;
      return next(error);
    }

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      const error: IAppError = new Error('Current password is incorrect') as IAppError;
      error.statusCode = 400;
      return next(error);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    const response: IApiResponse = {
      success: true,
      message: 'Password changed successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
