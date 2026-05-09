const db = require('../../config/db');

exports.getChallenges = async (req, res) => {
  try {
    const [challenges] = await db.query('SELECT * FROM challenges WHERE is_active = TRUE');
    const [userChallenges] = await db.query('SELECT * FROM user_challenges WHERE user_id = ?', [req.user.id]);
    const joined = userChallenges.reduce((acc, uc) => { acc[uc.challenge_id] = uc; return acc; }, {});
    const data = challenges.map(c => ({ ...c, user_status: joined[c.id] || null }));
    res.json({ success: true, challenges: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.joinChallenge = async (req, res) => {
  try {
    const { challenge_id } = req.body;
    const [existing] = await db.query(
      'SELECT id FROM user_challenges WHERE user_id = ? AND challenge_id = ? AND status = ?',
      [req.user.id, challenge_id, 'active']
    );
    if (existing.length > 0) return res.status(400).json({ success: false, message: 'Already in this challenge' });

    await db.query('INSERT INTO user_challenges (user_id, challenge_id) VALUES (?, ?)', [req.user.id, challenge_id]);
    res.json({ success: true, message: 'Challenge joined! 🎯' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.completeChallenge = async (req, res) => {
  try {
    const { user_challenge_id } = req.body;
    const [uc] = await db.query(
      'SELECT uc.*, c.reward_coins, c.reward_xp FROM user_challenges uc JOIN challenges c ON uc.challenge_id = c.id WHERE uc.id = ? AND uc.user_id = ?',
      [user_challenge_id, req.user.id]
    );
    if (uc.length === 0) return res.status(404).json({ success: false, message: 'User challenge not found' });

    await db.query('UPDATE user_challenges SET status = ?, completed_at = NOW() WHERE id = ?', ['completed', user_challenge_id]);
    await db.query('UPDATE users SET coins = coins + ?, xp = xp + ? WHERE id = ?', [uc[0].reward_coins, uc[0].reward_xp, req.user.id]);

    res.json({ success: true, message: 'Challenge completed!', reward_coins: uc[0].reward_coins, reward_xp: uc[0].reward_xp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUserChallenges = async (req, res) => {
  try {
    const [uc] = await db.query(
      'SELECT uc.*, c.title, c.description, c.duration_days, c.reward_coins, c.reward_xp FROM user_challenges uc JOIN challenges c ON uc.challenge_id = c.id WHERE uc.user_id = ? ORDER BY uc.joined_at DESC',
      [req.user.id]
    );
    res.json({ success: true, challenges: uc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
