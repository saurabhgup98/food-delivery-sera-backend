/**
 * Check if request is from localhost or local network
 * Returns true if request origin is localhost, 127.0.0.1, or local network IP
 * @param {Object} req - Express request object
 * @returns {boolean} - True if request is from local network
 */
export function isLocalRequest(req) {
  // Get origin from headers (check multiple possible header names)
  const origin = req.headers.origin || req.headers.referer || req.headers['x-forwarded-host'] || '';
  const host = req.headers.host || '';
  
  // Check if origin or host contains localhost/local network indicators
  const localhostPatterns = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '192.168.',
    '10.0.',
    '172.16.',
    '172.17.',
    '172.18.',
    '172.19.',
    '172.20.',
    '172.21.',
    '172.22.',
    '172.23.',
    '172.24.',
    '172.25.',
    '172.26.',
    '172.27.',
    '172.28.',
    '172.29.',
    '172.30.',
    '172.31.'
  ];
  
  const originLower = origin.toLowerCase();
  const hostLower = host.toLowerCase();
  
  // Check if origin or host matches localhost patterns
  for (const pattern of localhostPatterns) {
    if (originLower.includes(pattern) || hostLower.includes(pattern)) {
      return true;
    }
  }
  
  // Check if NODE_ENV is development (fallback - always return mock in dev)
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  return false;
}

