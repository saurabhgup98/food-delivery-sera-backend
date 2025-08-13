// Simple test script to verify backend setup
const express = require('express');
const app = express();

app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend setup is working!',
    timestamp: new Date().toISOString()
  });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
  console.log(`🔗 Test endpoint: http://localhost:${PORT}/test`);
});
