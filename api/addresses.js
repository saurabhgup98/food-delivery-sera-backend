import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();

    // For now, we'll use a mock user ID since we don't have authentication set up
    // In a real app, this would come from JWT token
    const userId = req.headers.authorization ? 'mock-user-id' : 'mock-user-id';

    switch (req.method) {
      case 'GET':
        // Get all addresses for user
        const addresses = await db.collection('addresses')
          .find({ userId })
          .sort({ isDefault: -1, createdAt: -1 })
          .toArray();
        
        res.status(200).json({
          success: true,
          data: { addresses }
        });
        break;

      case 'POST':
        // Create new address
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

      case 'PUT':
        // Update address
        const { id, ...updateData } = req.body;

        if (!id) {
          return res.status(400).json({
            success: false,
            message: 'Address ID is required'
          });
        }

        // If this is set as default, unset other defaults
        if (updateData.isDefault) {
          await db.collection('addresses').updateMany(
            { userId },
            { $set: { isDefault: false } }
          );
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

      case 'DELETE':
        // Delete address
        const { addressId } = req.query;

        if (!addressId) {
          return res.status(400).json({
            success: false,
            message: 'Address ID is required'
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
        res.status(405).json({
          success: false,
          message: 'Method not allowed'
        });
    }

    await client.close();
  } catch (error) {
    console.error('Addresses API error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
