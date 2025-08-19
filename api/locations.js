import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  const { type, countryCode, stateCode } = req.query;

  try {
    switch (type) {
      case 'countries':
        return await handleCountries(res);
      case 'states':
        if (!countryCode) {
          return res.status(400).json({
            success: false,
            message: 'Country code is required for states'
          });
        }
        return await handleStates(res, countryCode);
      case 'cities':
        if (!countryCode || !stateCode) {
          return res.status(400).json({
            success: false,
            message: 'Country code and state code are required for cities'
          });
        }
        return await handleCities(res, countryCode, stateCode);
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid type. Use: countries, states, or cities'
        });
    }
  } catch (error) {
    console.error('Locations API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

async function handleCountries(res) {
  try {
    // Fetch countries from external API
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,cca3');
    
    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }

    const countries = await response.json();

    // Process and format the data
    const formattedCountries = countries
      .map(country => ({
        name: country.name.common,
        code: country.cca2,
        code3: country.cca3,
        flag: `https://flagcdn.com/${country.cca2.toLowerCase()}.svg`
      }))
      .sort((a, b) => {
        // Put India first
        if (a.code === 'IN') return -1;
        if (b.code === 'IN') return 1;
        // Then sort alphabetically
        return a.name.localeCompare(b.name);
      });

    return res.status(200).json({
      success: true,
      message: 'Countries retrieved successfully',
      data: {
        countries: formattedCountries,
        total: formattedCountries.length
      }
    });

  } catch (error) {
    console.error('Countries API Error:', error);
    
    // Fallback data
    const fallbackCountries = [
      { name: 'India', code: 'IN', code3: 'IND', flag: 'https://flagcdn.com/in.svg' },
      { name: 'United States', code: 'US', code3: 'USA', flag: 'https://flagcdn.com/us.svg' },
      { name: 'United Kingdom', code: 'GB', code3: 'GBR', flag: 'https://flagcdn.com/gb.svg' },
      { name: 'Canada', code: 'CA', code3: 'CAN', flag: 'https://flagcdn.com/ca.svg' },
      { name: 'Australia', code: 'AU', code3: 'AUS', flag: 'https://flagcdn.com/au.svg' },
      { name: 'Germany', code: 'DE', code3: 'DEU', flag: 'https://flagcdn.com/de.svg' },
      { name: 'France', code: 'FR', code3: 'FRA', flag: 'https://flagcdn.com/fr.svg' },
      { name: 'Japan', code: 'JP', code3: 'JPN', flag: 'https://flagcdn.com/jp.svg' },
      { name: 'China', code: 'CN', code3: 'CHN', flag: 'https://flagcdn.com/cn.svg' },
      { name: 'Brazil', code: 'BR', code3: 'BRA', flag: 'https://flagcdn.com/br.svg' }
    ];

    return res.status(200).json({
      success: true,
      message: 'Countries retrieved successfully (fallback data)',
      data: {
        countries: fallbackCountries,
        total: fallbackCountries.length
      }
    });
  }
}

async function handleStates(res, countryCode) {
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
    
    // Fallback data for India
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
        { name: 'Odisha', code: 'OR', countryCode: 'IN' },
        { name: 'Punjab', code: 'PB', countryCode: 'IN' },
        { name: 'Rajasthan', code: 'RJ', countryCode: 'IN' },
        { name: 'Sikkim', code: 'SK', countryCode: 'IN' },
        { name: 'Tamil Nadu', code: 'TN', countryCode: 'IN' },
        { name: 'Telangana', code: 'TG', countryCode: 'IN' },
        { name: 'Tripura', code: 'TR', countryCode: 'IN' },
        { name: 'Uttar Pradesh', code: 'UP', countryCode: 'IN' },
        { name: 'Uttarakhand', code: 'UK', countryCode: 'IN' },
        { name: 'West Bengal', code: 'WB', countryCode: 'IN' },
        { name: 'Delhi', code: 'DL', countryCode: 'IN' }
      ];

      return res.status(200).json({
        success: true,
        message: 'States retrieved successfully (fallback data)',
        data: {
          states: indianStates,
          total: indianStates.length,
          countryCode
        }
      });
    }

    // Generic fallback
    const genericStates = [
      { name: 'State 1', code: 'S1', countryCode },
      { name: 'State 2', code: 'S2', countryCode },
      { name: 'State 3', code: 'S3', countryCode }
    ];

    return res.status(200).json({
      success: true,
      message: 'States retrieved successfully (fallback data)',
      data: {
        states: genericStates,
        total: genericStates.length,
        countryCode
      }
    });
  }
}

async function handleCities(res, countryCode, stateCode) {
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
      const indianCitiesByState = {
        'MH': [
          { name: 'Mumbai', code: 'MUM', stateCode: 'MH', countryCode: 'IN', population: 12442373 },
          { name: 'Pune', code: 'PUN', stateCode: 'MH', countryCode: 'IN', population: 3124458 },
          { name: 'Nagpur', code: 'NAG', stateCode: 'MH', countryCode: 'IN', population: 2405421 },
          { name: 'Nashik', code: 'NSK', stateCode: 'MH', countryCode: 'IN', population: 1486973 }
        ],
        'KA': [
          { name: 'Bangalore', code: 'BLR', stateCode: 'KA', countryCode: 'IN', population: 8443675 },
          { name: 'Mysore', code: 'MYS', stateCode: 'KA', countryCode: 'IN', population: 887446 },
          { name: 'Hubli', code: 'HUB', stateCode: 'KA', countryCode: 'IN', population: 943857 }
        ],
        'DL': [
          { name: 'New Delhi', code: 'DEL', stateCode: 'DL', countryCode: 'IN', population: 28514000 }
        ],
        'TN': [
          { name: 'Chennai', code: 'CHE', stateCode: 'TN', countryCode: 'IN', population: 4681087 },
          { name: 'Coimbatore', code: 'COI', stateCode: 'TN', countryCode: 'IN', population: 1061447 }
        ],
        'UP': [
          { name: 'Lucknow', code: 'LUC', stateCode: 'UP', countryCode: 'IN', population: 2817105 },
          { name: 'Kanpur', code: 'KAN', stateCode: 'UP', countryCode: 'IN', population: 2767031 }
        ]
      };

      const cities = indianCitiesByState[stateCode] || [
        { name: 'City 1', code: 'C1', stateCode, countryCode, population: 100000 },
        { name: 'City 2', code: 'C2', stateCode, countryCode, population: 75000 }
      ];

      return res.status(200).json({
        success: true,
        message: 'Cities retrieved successfully (fallback data)',
        data: {
          cities,
          total: cities.length,
          stateCode,
          countryCode
        }
      });
    }

    // Generic fallback
    const genericCities = [
      { name: 'City 1', code: 'C1', stateCode, countryCode, population: 100000 },
      { name: 'City 2', code: 'C2', stateCode, countryCode, population: 75000 },
      { name: 'City 3', code: 'C3', stateCode, countryCode, population: 50000 }
    ];

    return res.status(200).json({
      success: true,
      message: 'Cities retrieved successfully (fallback data)',
      data: {
        cities: genericCities,
        total: genericCities.length,
        stateCode,
        countryCode
      }
    });
  }
}
