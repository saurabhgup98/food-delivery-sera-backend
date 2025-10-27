/**
 * Address Handlers Module
 * Contains all address-related CRUD operations
 */

import { MongoClient, ObjectId } from 'mongodb';
import { validateAddress, validateAddressUpdate } from './userValidation.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery';

export async function handleAddressesRequest(req, res) {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();

    // For now, we'll use a mock user ID since we don't have authentication set up
    const userId = 'mock-user-id';
    const { action } = req.query;

    switch (action) {
      case 'addresses':
        return await handleGetAddresses(req, res, db, userId);
      case 'add-address':
        return await handleAddAddress(req, res, db, userId);
      case 'update-address':
        return await handleUpdateAddress(req, res, db, userId);
      case 'delete-address':
        return await handleDeleteAddress(req, res, db, userId);
      default:
        res.status(400).json({
          success: false,
          message: 'Invalid address action'
        });
    }

    await client.close();
  } catch (error) {
    console.error('Address API error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

async function handleGetAddresses(req, res, db, userId) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const addresses = await db.collection('addresses')
    .find({ userId })
    .sort({ isDefault: -1, createdAt: -1 })
    .toArray();
  
  res.status(200).json({
    success: true,
    data: { addresses }
  });
}

async function handleAddAddress(req, res, db, userId) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { label, fullName, phone, address, city, state, pincode, isDefault, instructions } = req.body;

  // Validate required fields
  const validation = validateAddress({ label, fullName, phone, address, city, state, pincode });
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: validation.error
    });
  }

  // If this is set as default, unset other defaults
  if (isDefault) {
    await db.collection('addresses').updateMany(
      { userId },
      { $set: { isDefault: false } }
    );
  }

  const newAddress = {
    userId,
    label,
    fullName,
    phone,
    address,
    city,
    state,
    pincode,
    isDefault: isDefault || false,
    instructions: instructions || '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await db.collection('addresses').insertOne(newAddress);
  newAddress._id = result.insertedId;

  res.status(201).json({
    success: true,
    data: { address: newAddress }
  });
}

async function handleUpdateAddress(req, res, db, userId) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { id, ...updateData } = req.body;
  
  console.log('Update address request:', { id, updateData, userId }); // Debug log

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Address ID is required'
    });
  }

  // Validate ObjectId format
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid address ID format'
    });
  }

  // Validate update data
  const validation = validateAddressUpdate(updateData);
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: validation.error
    });
  }

  // If this is set as default, unset other defaults
  if (updateData.isDefault) {
    await db.collection('addresses').updateMany(
      { userId },
      { $set: { isDefault: false } }
    );
  }

  // Check if address exists before updating
  const existingAddress = await db.collection('addresses').findOne({
    _id: new ObjectId(id),
    userId
  });
  
  console.log('Existing address found:', existingAddress ? 'Yes' : 'No'); // Debug log

  if (!existingAddress) {
    return res.status(404).json({
      success: false,
      message: 'Address not found'
    });
  }

  const updatedAddress = await db.collection('addresses').findOneAndUpdate(
    { _id: new ObjectId(id), userId },
    { 
      $set: { 
        ...updateData, 
        updatedAt: new Date() 
      } 
    },
    { returnDocument: 'after' }
  );

  console.log('Update result:', updatedAddress); // Debug log

  if (!updatedAddress.value) {
    return res.status(404).json({
      success: false,
      message: 'Address not found'
    });
  }

  res.status(200).json({
    success: true,
    data: { address: updatedAddress.value }
  });
}

async function handleDeleteAddress(req, res, db, userId) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { addressId } = req.query;

  if (!addressId) {
    return res.status(400).json({
      success: false,
      message: 'Address ID is required'
    });
  }

  // Validate ObjectId format
  if (!ObjectId.isValid(addressId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid address ID format'
    });
  }

  const deleteResult = await db.collection('addresses').deleteOne({
    _id: new ObjectId(addressId),
    userId
  });

  if (deleteResult.deletedCount === 0) {
    return res.status(404).json({
      success: false,
      message: 'Address not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Address deleted successfully'
  });
}
