const db = require('../../config/db');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const [userRows] = await db.query(
      'SELECT id, name, email, coins, xp, level, streak, avatar_url FROM users WHERE id = ?',
      [userId]
    );

    const [goalsStats] = await db.query(`
      SELECT 
        COUNT(*) as total_goals,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_goals,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_goals,
        SUM(CASE WHEN status = 'missed' THEN 1 ELSE 0 END) as missed_goals,
        SUM(saved_amount) as total_saved
      FROM saving_goals WHERE user_id = ?`, [userId]
    );

    const [activeGoals] = await db.query(
      'SELECT * FROM saving_goals WHERE user_id = ? AND status = ? ORDER BY deadline ASC LIMIT 5',
      [userId, 'active']
    );

    const [petRows] = await db.query('SELECT * FROM pets WHERE user_id = ?', [userId]);

    const [recentTx] = await db.query(
      'SELECT st.*, sg.title as goal_title FROM saving_transactions st JOIN saving_goals sg ON st.goal_id = sg.id WHERE st.user_id = ? ORDER BY st.date DESC LIMIT 5',
      [userId]
    );

    const [activeChallenges] = await db.query(
      'SELECT uc.*, c.title, c.description FROM user_challenges uc JOIN challenges c ON uc.challenge_id = c.id WHERE uc.user_id = ? AND uc.status = ?',
      [userId, 'active']
    );

    res.json({
      success: true,
      user: userRows[0],
      stats: goalsStats[0],
      active_goals: activeGoals,
      pet: petRows[0] || null,
      recent_transactions: recentTx,
      active_challenges: activeChallenges,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
