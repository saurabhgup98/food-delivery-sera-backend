import connectDB from '../lib/mongodb.js';
import { verifyToken } from '../lib/jwt.js';
import { MongoClient, ObjectId } from 'mongodb';
import { 
  handleProfile, 
  handleUpdateProfile, 
  handleCompleteProfile,
  handleSettings,
  handleUpdateSettings,
  handleChangePassword
} from '../lib/userHandlers.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { action } = req.query;

  // Handle addresses without authentication for now (mock user)
  if (action === 'addresses' || action === 'add-address' || action === 'update-address' || action === 'delete-address') {
    return handleAddressesRequest(req, res);
  }

  try {
    await connectDB();

    // Authentication check for all other user operations
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token required' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    switch (action) {
      case 'profile':
        return handleProfile(req, res, decoded.userId);
      case 'update-profile':
        return handleUpdateProfile(req, res, decoded.userId);
      case 'complete-profile':
        return handleCompleteProfile(req, res, decoded.userId);
      case 'settings':
        return handleSettings(req, res, decoded.userId);
      case 'update-settings':
        return handleUpdateSettings(req, res, decoded.userId);
      case 'change-password':
        return handleChangePassword(req, res, decoded.userId);
      default:
        return res.status(400).json({ success: false, message: 'Invalid action' });
    }

  } catch (error) {
    console.error('User API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}







// Address management using separate collection
async function handleAddressesRequest(req, res) {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();

    // For now, we'll use a mock user ID since we don't have authentication set up
    const userId = 'mock-user-id';
    const { action } = req.query;

    switch (action) {
      case 'addresses':
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
        break;

      case 'add-address':
        if (req.method !== 'POST') {
          return res.status(405).json({ success: false, message: 'Method not allowed' });
        }

        const { label, fullName, phone, address, city, state, pincode, isDefault, instructions } = req.body;

        // Validate required fields
        if (!label || !fullName || !phone || !address || !city || !state || !pincode) {
          return res.status(400).json({
            success: false,
            message: 'Missing required fields'
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
        break;

      case 'update-address':
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
        break;

      case 'delete-address':
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
        break;

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
