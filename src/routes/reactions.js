const express = require('express');
const router = express.Router();
const reactionService = require('../services/reactionService');

router.post('/', async (req, res) => {
  try {
    const reactionData = req.body;
    
    // Validación básica
    if (!reactionData.userId || !reactionData.bookUniqueId || !reactionData.emoji) {
      return res.status(400).json({
        success: false,
        error: 'userId, bookUniqueId y emoji son requeridos'
      });
    }

    const result = await reactionService.createOrUpdateReaction(reactionData);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error creating reaction:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al crear reacción'
    });
  }
});

module.exports = router;

