import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await client.connect();
    const database = client.db('food-delivery');
    const contactCollection = database.collection('contact_submissions');

    if (req.method === 'POST') {
      const {
        name,
        email,
        phone,
        preferredContact,
        category,
        orderReference,
        priority,
        bestTime,
        subject,
        message,
        attachments = []
      } = req.body;

      // Validate required fields
      if (!name || !email || !category || !message) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: name, email, category, and message are required'
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      // Generate ticket number
      const ticketNumber = 'TKT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();

      const contactSubmission = {
        ticketNumber,
        name,
        email,
        phone: phone || '',
        preferredContact: preferredContact || 'email',
        category,
        orderReference: orderReference || '',
        priority: priority || 'medium',
        bestTime: bestTime || 'afternoon',
        subject: subject || `SERA Support: ${category}`,
        message,
        attachments,
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await contactCollection.insertOne(contactSubmission);

      return res.status(201).json({
        success: true,
        message: 'Contact form submitted successfully',
        data: {
          ticketNumber,
          submissionId: result.insertedId
        }
      });
    }

    if (req.method === 'GET') {
      const { page = 1, limit = 10, status, category, priority } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Build filter
      const filter = {};
      if (status) filter.status = status;
      if (category) filter.category = category;
      if (priority) filter.priority = priority;

      // Get total count
      const totalCount = await contactCollection.countDocuments(filter);

      // Get submissions with pagination
      const submissions = await contactCollection
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray();

      // Get counts by status
      const statusCounts = await contactCollection.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]).toArray();

      // Get counts by category
      const categoryCounts = await contactCollection.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]).toArray();

      // Get counts by priority
      const priorityCounts = await contactCollection.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]).toArray();

      return res.status(200).json({
        success: true,
        message: 'Contact submissions retrieved successfully',
        data: {
          submissions,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalCount,
            totalPages: Math.ceil(totalCount / parseInt(limit))
          },
          counts: {
            total: totalCount,
            byStatus: statusCounts,
            byCategory: categoryCounts,
            byPriority: priorityCounts
          }
        }
      });
    }

    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });

  } catch (error) {
    console.error('Contact API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  } finally {
    await client.close();
  }
}
