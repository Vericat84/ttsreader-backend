const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Ejecutar migraciones al iniciar
async function runMigrations() {
  try {
    const pool = require('./db/connection');
    const migrationFile = path.join(__dirname, 'db', 'migrations', '001_initial_schema.sql');
    const sql = fs.readFileSync(migrationFile, 'utf8');
    await pool.query(sql);
    console.log('✅ Migraciones ejecutadas exitosamente');
  } catch (error) {
    // Si las tablas ya existen, ignorar el error
    if (error.message && error.message.includes('already exists')) {
      console.log('ℹ️  Las tablas ya existen, continuando...');
    } else {
      console.error('⚠️  Error en migraciones (continuando):', error.message);
    }
  }
}

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

// Iniciar servidor
async function startServer() {
  // Ejecutar migraciones primero
  await runMigrations();
  
  // Iniciar servidor
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();

