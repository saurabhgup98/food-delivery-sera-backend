export default function handler(req, res) {
  res.status(200).json({
    message: 'Food Delivery Backend API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
}
