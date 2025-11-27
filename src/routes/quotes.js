const express = require('express');
const router = express.Router();
const quoteService = require('../services/quoteService');

router.post('/', async (req, res) => {
  try {
    const quoteData = req.body;
    
    // Validación
    if (!quoteData.userId || !quoteData.bookUniqueId || !quoteData.textFragment) {
      return res.status(400).json({
        success: false,
        error: 'userId, bookUniqueId y textFragment son requeridos'
      });
    }

    const result = await quoteService.createQuote(quoteData);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error creating quote:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al crear cita'
    });
  }
});

module.exports = router;

