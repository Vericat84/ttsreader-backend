const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const reactionsRouter = require('./routes/reactions');
const quotesRouter = require('./routes/quotes');
const statsRouter = require('./routes/stats');
const usernameRouter = require('./routes/username');
const recommendationsRouter = require('./routes/recommendations');

app.use('/api/reactions', reactionsRouter);
app.use('/api/quotes', quotesRouter);
app.use('/api/stats', statsRouter);
app.use('/api/username', usernameRouter);
app.use('/api/recommendations', recommendationsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

