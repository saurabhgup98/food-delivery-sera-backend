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

  const { stateCode, countryCode } = req.query;

  if (!stateCode || !countryCode) {
    return res.status(400).json({
      success: false,
      message: 'State code and country code are required'
    });
  }

  try {
    // Use GeoDB Cities API to get cities for a state/region
    const response = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=${countryCode}&regionIds=${stateCode}&limit=50&sort=-population`, {
      headers: {
        'X-RapidAPI-Key': 'your-rapidapi-key', // You'll need to get a free key from RapidAPI
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch cities');
    }

    const data = await response.json();
    const cities = data.data || [];

    // Format the cities data
    const formattedCities = cities.map(city => ({
      name: city.name,
      code: city.id,
      stateCode: city.regionCode,
      countryCode: city.countryCode,
      population: city.population
    })).sort((a, b) => a.name.localeCompare(b.name));

    return res.status(200).json({
      success: true,
      message: 'Cities retrieved successfully',
      data: {
        cities: formattedCities,
        total: formattedCities.length,
        stateCode,
        countryCode
      }
    });

  } catch (error) {
    console.error('Cities API Error:', error);
    
    // Fallback data for major Indian cities by state
    if (countryCode === 'IN') {
      const indianCities = {
        'MH': [ // Maharashtra
          { name: 'Mumbai', code: 'MUM', stateCode: 'MH', countryCode: 'IN', population: 20411274 },
          { name: 'Pune', code: 'PUN', stateCode: 'MH', countryCode: 'IN', population: 3124458 },
          { name: 'Nagpur', code: 'NAG', stateCode: 'MH', countryCode: 'IN', population: 2970000 },
          { name: 'Thane', code: 'THA', stateCode: 'MH', countryCode: 'IN', population: 1841488 },
          { name: 'Nashik', code: 'NAS', stateCode: 'MH', countryCode: 'IN', population: 1486053 }
        ],
        'KA': [ // Karnataka
          { name: 'Bangalore', code: 'BLR', stateCode: 'KA', countryCode: 'IN', population: 12425304 },
          { name: 'Mysore', code: 'MYS', stateCode: 'KA', countryCode: 'IN', population: 920550 },
          { name: 'Hubli', code: 'HUB', stateCode: 'KA', countryCode: 'IN', population: 943788 },
          { name: 'Mangalore', code: 'MNG', stateCode: 'KA', countryCode: 'IN', population: 623841 }
        ],
        'DL': [ // Delhi
          { name: 'New Delhi', code: 'NDL', stateCode: 'DL', countryCode: 'IN', population: 16787941 },
          { name: 'Delhi', code: 'DEL', stateCode: 'DL', countryCode: 'IN', population: 16787941 }
        ],
        'TN': [ // Tamil Nadu
          { name: 'Chennai', code: 'CHE', stateCode: 'TN', countryCode: 'IN', population: 7088000 },
          { name: 'Coimbatore', code: 'COI', stateCode: 'TN', countryCode: 'IN', population: 2138584 },
          { name: 'Madurai', code: 'MAD', stateCode: 'TN', countryCode: 'IN', population: 1561129 },
          { name: 'Salem', code: 'SAL', stateCode: 'TN', countryCode: 'IN', population: 829267 }
        ],
        'AP': [ // Andhra Pradesh
          { name: 'Visakhapatnam', code: 'VIZ', stateCode: 'AP', countryCode: 'IN', population: 2035922 },
          { name: 'Vijayawada', code: 'VIJ', stateCode: 'AP', countryCode: 'IN', population: 1034358 },
          { name: 'Guntur', code: 'GUN', stateCode: 'AP', countryCode: 'IN', population: 743354 }
        ],
        'TS': [ // Telangana
          { name: 'Hyderabad', code: 'HYD', stateCode: 'TS', countryCode: 'IN', population: 6809970 },
          { name: 'Warangal', code: 'WAR', stateCode: 'TS', countryCode: 'IN', population: 704570 },
          { name: 'Karimnagar', code: 'KAR', stateCode: 'TS', countryCode: 'IN', population: 289821 }
        ],
        'GJ': [ // Gujarat
          { name: 'Ahmedabad', code: 'AHM', stateCode: 'GJ', countryCode: 'IN', population: 5570585 },
          { name: 'Surat', code: 'SUR', stateCode: 'GJ', countryCode: 'IN', population: 4467797 },
          { name: 'Vadodara', code: 'VAD', stateCode: 'GJ', countryCode: 'IN', population: 1670806 },
          { name: 'Rajkot', code: 'RAJ', stateCode: 'GJ', countryCode: 'IN', population: 1286678 }
        ],
        'UP': [ // Uttar Pradesh
          { name: 'Lucknow', code: 'LUC', stateCode: 'UP', countryCode: 'IN', population: 3382000 },
          { name: 'Kanpur', code: 'KAN', stateCode: 'UP', countryCode: 'IN', population: 2767057 },
          { name: 'Agra', code: 'AGR', stateCode: 'UP', countryCode: 'IN', population: 1585704 },
          { name: 'Varanasi', code: 'VAR', stateCode: 'UP', countryCode: 'IN', population: 1198491 }
        ],
        'WB': [ // West Bengal
          { name: 'Kolkata', code: 'KOL', stateCode: 'WB', countryCode: 'IN', population: 4486679 },
          { name: 'Howrah', code: 'HOW', stateCode: 'WB', countryCode: 'IN', population: 1077075 },
          { name: 'Durgapur', code: 'DUR', stateCode: 'WB', countryCode: 'IN', population: 566517 }
        ],
        'RJ': [ // Rajasthan
          { name: 'Jaipur', code: 'JAI', stateCode: 'RJ', countryCode: 'IN', population: 3073350 },
          { name: 'Jodhpur', code: 'JOD', stateCode: 'RJ', countryCode: 'IN', population: 1033756 },
          { name: 'Kota', code: 'KOT', stateCode: 'RJ', countryCode: 'IN', population: 1001694 },
          { name: 'Bikaner', code: 'BIK', stateCode: 'RJ', countryCode: 'IN', population: 647804 }
        ]
      };

      const citiesForState = indianCities[stateCode] || [];

      return res.status(200).json({
        success: true,
        message: 'Cities retrieved successfully (fallback data for India)',
        data: {
          cities: citiesForState,
          total: citiesForState.length,
          stateCode,
          countryCode
        }
      });
    }

    // Generic fallback for other countries
    const genericCities = [
      { name: 'City 1', code: 'CITY1', stateCode, countryCode, population: 100000 },
      { name: 'City 2', code: 'CITY2', stateCode, countryCode, population: 50000 },
      { name: 'City 3', code: 'CITY3', stateCode, countryCode, population: 25000 }
    ];

    return res.status(200).json({
      success: true,
      message: 'Cities retrieved successfully (generic fallback data)',
      data: {
        cities: genericCities,
        total: genericCities.length,
        stateCode,
        countryCode
      }
    });
  }
}
