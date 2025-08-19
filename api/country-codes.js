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
        const fullCode = countryCode + suffix;
        
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
      { name: 'Mexico', code: 'MX', phoneCode: '52', flag: 'https://flagcdn.com/mx.svg' },
      { name: 'South Africa', code: 'ZA', phoneCode: '27', flag: 'https://flagcdn.com/za.svg' },
      { name: 'Singapore', code: 'SG', phoneCode: '65', flag: 'https://flagcdn.com/sg.svg' },
      { name: 'United Arab Emirates', code: 'AE', phoneCode: '971', flag: 'https://flagcdn.com/ae.svg' },
      { name: 'Saudi Arabia', code: 'SA', phoneCode: '966', flag: 'https://flagcdn.com/sa.svg' },
      { name: 'Pakistan', code: 'PK', phoneCode: '92', flag: 'https://flagcdn.com/pk.svg' },
      { name: 'Bangladesh', code: 'BD', phoneCode: '880', flag: 'https://flagcdn.com/bd.svg' },
      { name: 'Sri Lanka', code: 'LK', phoneCode: '94', flag: 'https://flagcdn.com/lk.svg' },
      { name: 'Nepal', code: 'NP', phoneCode: '977', flag: 'https://flagcdn.com/np.svg' },
      { name: 'Bhutan', code: 'BT', phoneCode: '975', flag: 'https://flagcdn.com/bt.svg' },
      { name: 'Maldives', code: 'MV', phoneCode: '960', flag: 'https://flagcdn.com/mv.svg' }
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
      { name: 'Brazil', code: 'BR', phoneCode: '55', flag: 'https://flagcdn.com/br.svg' },
      { name: 'Mexico', code: 'MX', phoneCode: '52', flag: 'https://flagcdn.com/mx.svg' },
      { name: 'South Africa', code: 'ZA', phoneCode: '27', flag: 'https://flagcdn.com/za.svg' },
      { name: 'Singapore', code: 'SG', phoneCode: '65', flag: 'https://flagcdn.com/sg.svg' },
      { name: 'United Arab Emirates', code: 'AE', phoneCode: '971', flag: 'https://flagcdn.com/ae.svg' },
      { name: 'Saudi Arabia', code: 'SA', phoneCode: '966', flag: 'https://flagcdn.com/sa.svg' },
      { name: 'Pakistan', code: 'PK', phoneCode: '92', flag: 'https://flagcdn.com/pk.svg' },
      { name: 'Bangladesh', code: 'BD', phoneCode: '880', flag: 'https://flagcdn.com/bd.svg' },
      { name: 'Sri Lanka', code: 'LK', phoneCode: '94', flag: 'https://flagcdn.com/lk.svg' },
      { name: 'Nepal', code: 'NP', phoneCode: '977', flag: 'https://flagcdn.com/np.svg' },
      { name: 'Bhutan', code: 'BT', phoneCode: '975', flag: 'https://flagcdn.com/bt.svg' },
      { name: 'Maldives', code: 'MV', phoneCode: '960', flag: 'https://flagcdn.com/mv.svg' }
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
