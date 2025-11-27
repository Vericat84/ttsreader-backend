const express = require('express');
const router = express.Router();
const statsService = require('../services/statsService');

router.get('/:bookUniqueId', async (req, res) => {
  try {
    const { bookUniqueId } = req.params;
    
    let stats = await statsService.getStatsForBook(bookUniqueId);
    
    // Si no existen, calcularlas
    if (!stats) {
      await statsService.updateStatsForBook(bookUniqueId);
      stats = await statsService.getStatsForBook(bookUniqueId);
    }
    
    if (!stats) {
      return res.json({
        success: true,
        data: {
          bookUniqueId,
          totalReaders: 0,
          currentlyReading: 0,
          totalCompleted: 0,
          totalReactions: 0,
          reactionsByEmoji: {},
          chapterReactions: {},
          pageReactions: {},
          timestampReactions: {},
          topQuotes: [],
          topPages: [],
          topTimestamps: [],
          lastUpdated: Date.now()
        }
      });
    }
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener estadísticas'
    });
  }
});

module.exports = router;

