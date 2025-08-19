export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  const { countryCode } = req.query;

  if (!countryCode) {
    return res.status(400).json({
      success: false,
      message: 'Country code is required'
    });
  }

  try {
    // Use GeoDB Cities API to get states/regions for a country
    const response = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${countryCode}/regions`, {
      headers: {
        'X-RapidAPI-Key': 'your-rapidapi-key', // You'll need to get a free key from RapidAPI
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch states');
    }

    const data = await response.json();
    const states = data.data || [];

    // Format the states data
    const formattedStates = states.map(state => ({
      name: state.name,
      code: state.code,
      countryCode: state.countryCode
    })).sort((a, b) => a.name.localeCompare(b.name));

    return res.status(200).json({
      success: true,
      message: 'States retrieved successfully',
      data: {
        states: formattedStates,
        total: formattedStates.length,
        countryCode
      }
    });

  } catch (error) {
    console.error('States API Error:', error);
    
    // Fallback data for India (most common use case)
    if (countryCode === 'IN') {
      const indianStates = [
        { name: 'Andhra Pradesh', code: 'AP', countryCode: 'IN' },
        { name: 'Arunachal Pradesh', code: 'AR', countryCode: 'IN' },
        { name: 'Assam', code: 'AS', countryCode: 'IN' },
        { name: 'Bihar', code: 'BR', countryCode: 'IN' },
        { name: 'Chhattisgarh', code: 'CG', countryCode: 'IN' },
        { name: 'Goa', code: 'GA', countryCode: 'IN' },
        { name: 'Gujarat', code: 'GJ', countryCode: 'IN' },
        { name: 'Haryana', code: 'HR', countryCode: 'IN' },
        { name: 'Himachal Pradesh', code: 'HP', countryCode: 'IN' },
        { name: 'Jharkhand', code: 'JH', countryCode: 'IN' },
        { name: 'Karnataka', code: 'KA', countryCode: 'IN' },
        { name: 'Kerala', code: 'KL', countryCode: 'IN' },
        { name: 'Madhya Pradesh', code: 'MP', countryCode: 'IN' },
        { name: 'Maharashtra', code: 'MH', countryCode: 'IN' },
        { name: 'Manipur', code: 'MN', countryCode: 'IN' },
        { name: 'Meghalaya', code: 'ML', countryCode: 'IN' },
        { name: 'Mizoram', code: 'MZ', countryCode: 'IN' },
        { name: 'Nagaland', code: 'NL', countryCode: 'IN' },
        { name: 'Odisha', code: 'OD', countryCode: 'IN' },
        { name: 'Punjab', code: 'PB', countryCode: 'IN' },
        { name: 'Rajasthan', code: 'RJ', countryCode: 'IN' },
        { name: 'Sikkim', code: 'SK', countryCode: 'IN' },
        { name: 'Tamil Nadu', code: 'TN', countryCode: 'IN' },
        { name: 'Telangana', code: 'TS', countryCode: 'IN' },
        { name: 'Tripura', code: 'TR', countryCode: 'IN' },
        { name: 'Uttar Pradesh', code: 'UP', countryCode: 'IN' },
        { name: 'Uttarakhand', code: 'UK', countryCode: 'IN' },
        { name: 'West Bengal', code: 'WB', countryCode: 'IN' },
        { name: 'Delhi', code: 'DL', countryCode: 'IN' },
        { name: 'Jammu and Kashmir', code: 'JK', countryCode: 'IN' },
        { name: 'Ladakh', code: 'LA', countryCode: 'IN' },
        { name: 'Chandigarh', code: 'CH', countryCode: 'IN' },
        { name: 'Dadra and Nagar Haveli and Daman and Diu', code: 'DN', countryCode: 'IN' },
        { name: 'Lakshadweep', code: 'LD', countryCode: 'IN' },
        { name: 'Puducherry', code: 'PY', countryCode: 'IN' },
        { name: 'Andaman and Nicobar Islands', code: 'AN', countryCode: 'IN' }
      ];

      return res.status(200).json({
        success: true,
        message: 'States retrieved successfully (fallback data for India)',
        data: {
          states: indianStates,
          total: indianStates.length,
          countryCode
        }
      });
    }

    // Generic fallback for other countries
    const genericStates = [
      { name: 'State 1', code: 'ST1', countryCode },
      { name: 'State 2', code: 'ST2', countryCode },
      { name: 'State 3', code: 'ST3', countryCode }
    ];

    return res.status(200).json({
      success: true,
      message: 'States retrieved successfully (generic fallback data)',
      data: {
        states: genericStates,
        total: genericStates.length,
        countryCode
      }
    });
  }
}
