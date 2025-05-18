const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/jobs', async (req, res) => {
  const page = req.query.page || 1;
  const searchQuery = req.query.query || 'data science';

  const API_URL = `https://api.adzuna.com/v1/api/jobs/us/search/${page}?app_id=63ac74b5&app_key=e19ddcaa3cc76cc12884a2dd7bb60775&what=${encodeURIComponent(searchQuery)}`;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Backend fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch job data' });
  }
});
 
app.post('/feedback', (req, res) => {
  const feedback = req.body;

  console.log('Received feedback:', feedback);

  res.status(201).json({
    message: 'Feedback received successfully!',
    data: feedback
  });
});

// Test route
app.get('/test', (req, res) => {
  res.send('Server is working!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});