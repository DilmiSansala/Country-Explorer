// server.js - Main server file
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;


// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory users database (for demo purposes)
// In a real app, you would use MongoDB, PostgreSQL, etc.
const users = [
  {
    id: '1',
    username: 'dilmi',
    // Hashed password for 'password123'
    password: '$2a$10$XQPJDRPvO9jFV2m5BIfn5e.5ZFNlnwsuTOFvpSA6RWBiQP34zBWni',
    favoriteCountries: []
  }
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access token required' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign(
      { id: user.id, username: user.username }, 
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      user: { id: user.id, username: user.username },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user exists
    if (users.some(u => u.username === username)) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      username,
      password: hashedPassword,
      favoriteCountries: []
    };
    
    users.push(newUser);
    
    // Create token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      user: { id: newUser.id, username: newUser.username },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected route to get user data
app.get('/api/user', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  
  res.json({
    id: user.id,
    username: user.username,
    favoriteCountries: user.favoriteCountries
  });
});

// Favorites API routes
app.post('/api/favorites', authenticateToken, (req, res) => {
  try {
    const { countryCode } = req.body;
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Add to favorites if not already present
    if (!user.favoriteCountries.includes(countryCode)) {
      user.favoriteCountries.push(countryCode);
    }
    
    res.json({ favoriteCountries: user.favoriteCountries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/favorites/:countryCode', authenticateToken, (req, res) => {
  try {
    const { countryCode } = req.params;
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Remove from favorites
    user.favoriteCountries = user.favoriteCountries.filter(code => code !== countryCode);
    
    res.json({ favoriteCountries: user.favoriteCountries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/favorites', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ favoriteCountries: user.favoriteCountries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});