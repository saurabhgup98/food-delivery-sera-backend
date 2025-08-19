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
    
    // Fallback data if external API fails
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
      { name: 'Brazil', code: 'BR', code3: 'BRA', flag: 'https://flagcdn.com/br.svg' },
      { name: 'Mexico', code: 'MX', code3: 'MEX', flag: 'https://flagcdn.com/mx.svg' },
      { name: 'South Africa', code: 'ZA', code3: 'ZAF', flag: 'https://flagcdn.com/za.svg' },
      { name: 'Singapore', code: 'SG', code3: 'SGP', flag: 'https://flagcdn.com/sg.svg' },
      { name: 'United Arab Emirates', code: 'AE', code3: 'ARE', flag: 'https://flagcdn.com/ae.svg' },
      { name: 'Saudi Arabia', code: 'SA', code3: 'SAU', flag: 'https://flagcdn.com/sa.svg' },
      { name: 'Pakistan', code: 'PK', code3: 'PAK', flag: 'https://flagcdn.com/pk.svg' },
      { name: 'Bangladesh', code: 'BD', code3: 'BGD', flag: 'https://flagcdn.com/bd.svg' },
      { name: 'Sri Lanka', code: 'LK', code3: 'LKA', flag: 'https://flagcdn.com/lk.svg' },
      { name: 'Nepal', code: 'NP', code3: 'NPL', flag: 'https://flagcdn.com/np.svg' },
      { name: 'Bhutan', code: 'BT', code3: 'BTN', flag: 'https://flagcdn.com/bt.svg' },
      { name: 'Maldives', code: 'MV', code3: 'MDV', flag: 'https://flagcdn.com/mv.svg' }
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
