import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import { IAuthRequest } from '../types/index.js';

const router = express.Router();

const upsertCustomerProfile = async (req: IAuthRequest) => {
  if (!req.user?.email) {
    throw new Error('Missing user email in token payload');
  }

  const filter =
    req.user.id
      ? { $or: [{ authUserId: req.user.id }, { email: req.user.email }] }
      : { email: req.user.email };

  const update = {
    $set: {
      email: req.user.email.toLowerCase().trim(),
      authUserId: req.user.id,
      isActive: true,
      lastLoginAt: new Date(),
    },
    $setOnInsert: {
      metadata: {
        source: 'central-auth-bootstrap',
      },
    },
  };

  const user = await User.findOneAndUpdate(
    filter,
    update,
    { new: true, upsert: true, runValidators: true }
  ).lean();

  return user;
};

// Bootstrap a customer profile from centralized auth token.
router.post('/bootstrap', protect, async (req: IAuthRequest, res, next) => {
  try {
    const user = await upsertCustomerProfile(req);

    res.status(200).json({
      success: true,
      message: 'Customer profile synced successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

// Return current customer profile from token and ensure it exists.
router.get('/me', protect, async (req: IAuthRequest, res, next) => {
  try {
    const user = await upsertCustomerProfile(req);

    res.status(200).json({
      success: true,
      message: 'Customer profile fetched successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

// Backward-compatible users endpoint: returns current profile.
router.get('/', protect, async (req: IAuthRequest, res, next) => {
  try {
    const user = await upsertCustomerProfile(req);
    res.status(200).json({
      success: true,
      message: 'User profile fetched successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
