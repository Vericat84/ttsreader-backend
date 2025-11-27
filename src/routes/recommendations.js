const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Obtener libros del usuario
    const userResult = await pool.query(
      'SELECT books_read, books_completed FROM profiles WHERE user_id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.json({
        success: true,
        data: { recommendations: [] }
      });
    }

    const userBooks = [
      ...(userResult.rows[0].books_read || []),
      ...(userResult.rows[0].books_completed || [])
    ];

    if (userBooks.length === 0) {
      return res.json({
        success: true,
        data: { recommendations: [] }
      });
    }

    // Encontrar usuarios similares y sus libros
    // Por ahora, retornar lista vacía (implementar algoritmo después)
    const recommendations = [];

    res.json({
      success: true,
      data: { recommendations }
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener recomendaciones'
    });
  }
});

module.exports = router;

