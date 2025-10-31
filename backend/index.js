require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log('Database connected successfully');

app.get('/api/districts', (req, res) => {
  try {
    const districts = db.getAllDistricts();
    console.log(`Fetched ${districts.length} districts`);
    res.json(districts);
  } catch (err) {
    console.error('Error fetching districts:', err);
    res.status(500).json({ error: 'Failed to fetch districts', message: err.message });
  }
});

app.get('/api/performance/:districtCode', (req, res) => {
  try {
    const { districtCode } = req.params;
    console.log(`Fetching performance for district: ${districtCode}`);
    const data = db.getPerformanceData(districtCode, 12);
    console.log(`Found ${data.length} performance records for ${districtCode}`);
    res.json(data);
  } catch (err) {
    console.error('Error fetching performance data:', err);
    res.status(500).json({ error: 'Failed to fetch performance data', message: err.message });
  }
});

app.get('/api/district/:districtCode', (req, res) => {
  try {
    const { districtCode } = req.params;
    const district = db.getDistrict(districtCode);
    res.json(district || null);
  } catch (err) {
    console.error('Error fetching district:', err);
    res.status(500).json({ error: 'Failed to fetch district', message: err.message });
  }
});

app.get('/api/compare', (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const data = db.getComparisonData(currentMonth);
    res.json(data);
  } catch (err) {
    console.error('Error fetching comparison data:', err);
    res.status(500).json({ error: 'Failed to fetch comparison data', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
