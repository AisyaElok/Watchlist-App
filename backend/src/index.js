const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const filmRoutes = require('./routes/films');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://lokiie-picks.vercel.app', 'https://lokiie-picks-git-main-aisya-elok-s-projects.vercel.app']
}))
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/films', filmRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Watchlist API berjalan ✅', version: '1.0.0' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
