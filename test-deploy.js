// Simple test to check if deployment is working
import express from 'express';

const app = express();

app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Food Delivery Backend Test',
    status: 'running'
  });
});

// For Vercel serverless functions, we need to export the app
export default app;
