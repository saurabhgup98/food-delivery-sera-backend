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

  const { type } = req.query;

  try {
    switch (type) {
      case 'contact':
        return await handleContact(req, res);
      case 'country-codes':
        return await handleCountryCodes(req, res);
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid type. Use: contact or country-codes'
        });
    }
  } catch (error) {
    console.error('Utilities API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

async function handleContact(req, res) {
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

      // Get submissions with pagination
      const submissions = await contactCollection
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray();

      // Get total count
      const total = await contactCollection.countDocuments(filter);
      const totalPages = Math.ceil(total / parseInt(limit));

      // Get counts by status, category, and priority
      const statusCounts = await contactCollection.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]).toArray();

      const categoryCounts = await contactCollection.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]).toArray();

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
            total,
            totalPages
          },
          counts: {
            total,
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

async function handleCountryCodes(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // Fetch country codes from external API
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd');
    
    if (!response.ok) {
      throw new Error('Failed to fetch country codes');
    }

    const countries = await response.json();

    // Process and format the data
    const formattedCountries = countries
      .map(country => {
        const countryCode = country.idd?.root || '';
        const suffix = country.idd?.suffixes?.[0] || '';
        const fullCode = (countryCode + suffix).replace(/^\+/, ''); // Remove leading + if present
        
        return {
          name: country.name.common,
          code: country.cca2,
          phoneCode: fullCode,
          flag: `https://flagcdn.com/${country.cca2.toLowerCase()}.svg`
        };
      })
      .filter(country => country.phoneCode) // Only include countries with phone codes
      .sort((a, b) => {
        // Put India first
        if (a.code === 'IN') return -1;
        if (b.code === 'IN') return 1;
        // Then sort alphabetically
        return a.name.localeCompare(b.name);
      });

    // Add some important countries at the top (after India)
    const importantCountries = [
      { name: 'United States', code: 'US', phoneCode: '1', flag: 'https://flagcdn.com/us.svg' },
      { name: 'United Kingdom', code: 'GB', phoneCode: '44', flag: 'https://flagcdn.com/gb.svg' },
      { name: 'Canada', code: 'CA', phoneCode: '1', flag: 'https://flagcdn.com/ca.svg' },
      { name: 'Australia', code: 'AU', phoneCode: '61', flag: 'https://flagcdn.com/au.svg' },
      { name: 'Germany', code: 'DE', phoneCode: '49', flag: 'https://flagcdn.com/de.svg' },
      { name: 'France', code: 'FR', phoneCode: '33', flag: 'https://flagcdn.com/fr.svg' },
      { name: 'Japan', code: 'JP', phoneCode: '81', flag: 'https://flagcdn.com/jp.svg' },
      { name: 'China', code: 'CN', phoneCode: '86', flag: 'https://flagcdn.com/cn.svg' },
      { name: 'Brazil', code: 'BR', phoneCode: '55', flag: 'https://flagcdn.com/br.svg' },
      { name: 'Russia', code: 'RU', phoneCode: '7', flag: 'https://flagcdn.com/ru.svg' }
    ];

    // Create final list with important countries first, then the rest
    const finalList = [
      ...importantCountries,
      ...formattedCountries.filter(country => 
        !importantCountries.some(important => important.code === country.code)
      )
    ];

    return res.status(200).json({
      success: true,
      message: 'Country codes retrieved successfully',
      data: {
        countries: finalList,
        total: finalList.length
      }
    });

  } catch (error) {
    console.error('Country Codes API Error:', error);
    
    // Fallback data if external API fails
    const fallbackCountries = [
      { name: 'India', code: 'IN', phoneCode: '91', flag: 'https://flagcdn.com/in.svg' },
      { name: 'United States', code: 'US', phoneCode: '1', flag: 'https://flagcdn.com/us.svg' },
      { name: 'United Kingdom', code: 'GB', phoneCode: '44', flag: 'https://flagcdn.com/gb.svg' },
      { name: 'Canada', code: 'CA', phoneCode: '1', flag: 'https://flagcdn.com/ca.svg' },
      { name: 'Australia', code: 'AU', phoneCode: '61', flag: 'https://flagcdn.com/au.svg' },
      { name: 'Germany', code: 'DE', phoneCode: '49', flag: 'https://flagcdn.com/de.svg' },
      { name: 'France', code: 'FR', phoneCode: '33', flag: 'https://flagcdn.com/fr.svg' },
      { name: 'Japan', code: 'JP', phoneCode: '81', flag: 'https://flagcdn.com/jp.svg' },
      { name: 'China', code: 'CN', phoneCode: '86', flag: 'https://flagcdn.com/cn.svg' },
      { name: 'Brazil', code: 'BR', phoneCode: '55', flag: 'https://flagcdn.com/br.svg' }
    ];

    return res.status(200).json({
      success: true,
      message: 'Country codes retrieved successfully (fallback data)',
      data: {
        countries: fallbackCountries,
        total: fallbackCountries.length
      }
    });
  }
}
