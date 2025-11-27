const pool = require('../db/connection');
const statsService = require('./statsService');

class ReactionService {
  async createOrUpdateReaction(reactionData) {
    const {
      userId,
      bookUniqueId,
      targetType,
      chapterIndex,
      pageNumber,
      timestampPosition,
      quoteId,
      emoji,
      predefinedMessageId,
      timestamp
    } = reactionData;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Buscar reacción existente
      const findQuery = `
        SELECT id FROM reactions
        WHERE user_id = $1 
          AND book_unique_id = $2 
          AND target_type = $3
          AND COALESCE(chapter_index, -1) = COALESCE($4, -1)
          AND COALESCE(page_number, -1) = COALESCE($5, -1)
          AND COALESCE(timestamp_position, -1) = COALESCE($6, -1)
          AND COALESCE(quote_id, -1) = COALESCE($7, -1)
      `;
      
      const findResult = await client.query(findQuery, [
        userId, bookUniqueId, targetType, chapterIndex, 
        pageNumber, timestampPosition, quoteId
      ]);

      let reactionId;
      if (findResult.rows.length > 0) {
        // Actualizar
        const updateQuery = `
          UPDATE reactions 
          SET emoji = $1, 
              predefined_message_id = $2,
              updated_at = NOW()
          WHERE id = $3
          RETURNING id
        `;
        const updateResult = await client.query(updateQuery, [
          emoji, predefinedMessageId, findResult.rows[0].id
        ]);
        reactionId = updateResult.rows[0].id;
      } else {
        // Crear nueva
        const insertQuery = `
          INSERT INTO reactions (
            user_id, book_unique_id, target_type, chapter_index,
            page_number, timestamp_position, quote_id, emoji,
            predefined_message_id, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 
                   TO_TIMESTAMP($10 / 1000), NOW())
          RETURNING id
        `;
        const insertResult = await client.query(insertQuery, [
          userId, bookUniqueId, targetType, chapterIndex,
          pageNumber, timestampPosition, quoteId, emoji,
          predefinedMessageId, timestamp
        ]);
        reactionId = insertResult.rows[0].id;
      }

      await client.query('COMMIT');

      // Actualizar estadísticas (async, no bloquea)
      statsService.updateStatsForBook(bookUniqueId).catch(err => {
        console.error('Error updating stats:', err);
      });

      return { success: true, reactionId };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new ReactionService();

