const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

router.post('/check', async (req, res) => {
  try {
    const { displayName } = req.body;
    
    if (!displayName || displayName.trim().length === 0) {
      return res.json({
        success: true,
        data: {
          available: false,
          message: 'El nombre no puede estar vacío'
        }
      });
    }

    // Validar longitud
    if (displayName.length > 100) {
      return res.json({
        success: true,
        data: {
          available: false,
          message: 'El nombre no puede tener más de 100 caracteres'
        }
      });
    }

    // Buscar en base de datos
    const result = await pool.query(
      'SELECT user_id FROM profiles WHERE display_name = $1',
      [displayName.trim()]
    );

    const available = result.rows.length === 0;
    
    res.json({
      success: true,
      data: {
        available,
        message: available ? 'Nombre disponible' : 'Nombre no disponible'
      }
    });
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al verificar nombre'
    });
  }
});

module.exports = router;

