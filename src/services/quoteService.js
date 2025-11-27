const pool = require('../db/connection');
const statsService = require('./statsService');

class QuoteService {
  async createQuote(quoteData) {
    const {
      userId,
      bookUniqueId,
      chapterIndex,
      textFragment,
      positionStart,
      positionEnd,
      createdAt
    } = quoteData;

    // Validar
    if (!textFragment || textFragment.length === 0 || textFragment.length > 500) {
      throw new Error('textFragment debe tener entre 1 y 500 caracteres');
    }

    const query = `
      INSERT INTO quotes (
        user_id, book_unique_id, chapter_index,
        text_fragment, position_start, position_end, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, TO_TIMESTAMP($7 / 1000))
      RETURNING id
    `;

    const result = await pool.query(query, [
      userId, bookUniqueId, chapterIndex,
      textFragment, positionStart, positionEnd, createdAt
    ]);

    const quoteId = result.rows[0].id;

    // Actualizar estadísticas (async)
    statsService.updateStatsForBook(bookUniqueId).catch(err => {
      console.error('Error updating stats:', err);
    });

    return { success: true, quoteId };
  }
}

module.exports = new QuoteService();

