const pool = require('../db/connection');

class StatsService {
  async updateStatsForBook(bookUniqueId) {
    const client = await pool.connect();
    try {
      // Obtener todas las reacciones del libro
      const reactionsResult = await client.query(
        'SELECT * FROM reactions WHERE book_unique_id = $1',
        [bookUniqueId]
      );
      const reactions = reactionsResult.rows;

      // Obtener todas las citas del libro
      const quotesResult = await client.query(
        'SELECT * FROM quotes WHERE book_unique_id = $1',
        [bookUniqueId]
      );
      const quotes = quotesResult.rows;

      // Calcular estadísticas
      const stats = this.calculateStats(reactions, quotes);

      // Guardar o actualizar en cache
      const upsertQuery = `
        INSERT INTO book_community_stats (
          book_unique_id, total_readers, currently_reading,
          total_completed, total_reactions, reactions_by_emoji,
          chapter_reactions, page_reactions, timestamp_reactions,
          top_quotes, top_pages, top_timestamps, last_updated
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
        ON CONFLICT (book_unique_id) DO UPDATE SET
          total_readers = EXCLUDED.total_readers,
          currently_reading = EXCLUDED.currently_reading,
          total_completed = EXCLUDED.total_completed,
          total_reactions = EXCLUDED.total_reactions,
          reactions_by_emoji = EXCLUDED.reactions_by_emoji,
          chapter_reactions = EXCLUDED.chapter_reactions,
          page_reactions = EXCLUDED.page_reactions,
          timestamp_reactions = EXCLUDED.timestamp_reactions,
          top_quotes = EXCLUDED.top_quotes,
          top_pages = EXCLUDED.top_pages,
          top_timestamps = EXCLUDED.top_timestamps,
          last_updated = NOW()
      `;

      await client.query(upsertQuery, [
        bookUniqueId,
        stats.totalReaders,
        stats.currentlyReading,
        stats.totalCompleted,
        stats.totalReactions,
        JSON.stringify(stats.reactionsByEmoji),
        JSON.stringify(stats.chapterReactions),
        JSON.stringify(stats.pageReactions),
        JSON.stringify(stats.timestampReactions),
        stats.topQuotes,
        stats.topPages,
        stats.topTimestamps
      ]);
    } finally {
      client.release();
    }
  }

  calculateStats(reactions, quotes) {
    // Usuarios únicos
    const uniqueUserIds = new Set();
    reactions.forEach(r => uniqueUserIds.add(r.user_id));
    quotes.forEach(q => uniqueUserIds.add(q.user_id));
    const totalReaders = uniqueUserIds.size;

    // Usuarios leyendo ahora (últimos 7 días)
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentReactions = reactions.filter(r => 
      new Date(r.created_at).getTime() > sevenDaysAgo
    );
    const recentUserIds = new Set(recentReactions.map(r => r.user_id));
    const currentlyReading = recentUserIds.size;

    // Completados (aproximación: usuarios con reacciones en capítulos finales)
    // Por ahora, usar usuarios que tienen el libro en booksCompleted
    const totalCompleted = 0; // Se puede mejorar consultando profiles

    // Total reacciones
    const totalReactions = reactions.length;

    // Reacciones por emoji
    const reactionsByEmoji = {};
    reactions.forEach(r => {
      reactionsByEmoji[r.emoji] = (reactionsByEmoji[r.emoji] || 0) + 1;
    });

    // Heatmaps
    const chapterReactions = {};
    const pageReactions = {};
    const timestampReactions = {};

    reactions.forEach(r => {
      if (r.chapter_index !== null) {
        chapterReactions[r.chapter_index] = (chapterReactions[r.chapter_index] || 0) + 1;
      }
      if (r.page_number !== null) {
        pageReactions[r.page_number] = (pageReactions[r.page_number] || 0) + 1;
      }
      if (r.timestamp_position !== null) {
        timestampReactions[r.timestamp_position] = (timestampReactions[r.timestamp_position] || 0) + 1;
      }
    });

    // Top quotes (citas más reaccionadas)
    const quoteReactionCounts = {};
    reactions.forEach(r => {
      if (r.quote_id !== null) {
        quoteReactionCounts[r.quote_id] = (quoteReactionCounts[r.quote_id] || 0) + 1;
      }
    });
    const topQuotes = Object.entries(quoteReactionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id]) => parseInt(id));

    // Top pages
    const topPages = Object.entries(pageReactions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([page]) => parseInt(page));

    // Top timestamps
    const topTimestamps = Object.entries(timestampReactions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ts]) => parseInt(ts));

    return {
      totalReaders,
      currentlyReading,
      totalCompleted,
      totalReactions,
      reactionsByEmoji,
      chapterReactions,
      pageReactions,
      timestampReactions,
      topQuotes,
      topPages,
      topTimestamps
    };
  }

  async getStatsForBook(bookUniqueId) {
    const result = await pool.query(
      'SELECT * FROM book_community_stats WHERE book_unique_id = $1',
      [bookUniqueId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const stats = result.rows[0];
    return {
      bookUniqueId: stats.book_unique_id,
      totalReaders: stats.total_readers,
      currentlyReading: stats.currently_reading,
      totalCompleted: stats.total_completed,
      totalReactions: stats.total_reactions,
      reactionsByEmoji: stats.reactions_by_emoji || {},
      chapterReactions: stats.chapter_reactions || {},
      pageReactions: stats.page_reactions || {},
      timestampReactions: stats.timestamp_reactions || {},
      topQuotes: stats.top_quotes || [],
      topPages: stats.top_pages || [],
      topTimestamps: stats.top_timestamps || [],
      lastUpdated: new Date(stats.last_updated).getTime()
    };
  }
}

module.exports = new StatsService();

