const db = require('../../config/db');

exports.getArchives = async (req, res) => {
  try {
    const [archives] = await db.query('SELECT * FROM goal_archives WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json({ success: true, archives });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAchievements = async (req, res) => {
  try {
    const [achievements] = await db.query('SELECT * FROM achievements WHERE user_id = ? ORDER BY earned_at DESC', [req.user.id]);
    res.json({ success: true, achievements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
