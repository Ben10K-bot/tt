const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const readJSONFile = (filename) => {
  try {
    const filePath = path.join(__dirname, 'data', filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
};

app.get('/api/info', (req, res) => {
  const info = readJSONFile('info.json');
  if (info) {
    res.json(info);
  } else {
    res.status(500).json({ error: 'Failed to load info data' });
  }
});

app.get('/api/services', (req, res) => {
  const services = readJSONFile('services.json');
  if (services) {
    res.json(services);
  } else {
    res.status(500).json({ error: 'Failed to load services data' });
  }
});

app.get('/api/skills', (req, res) => {
  const skills = readJSONFile('skills.json');
  if (skills) {
    res.json(skills);
  } else {
    res.status(500).json({ error: 'Failed to load skills data' });
  }
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Glitch Portfolio server running on port ${PORT}`);
  console.log(`📱 Local: http://localhost:${PORT}`);
  console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
});

module.exports = app;