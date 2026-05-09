const db = require('../../config/db');

exports.getGoals = async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM saving_goals WHERE user_id = ?';
    const params = [req.user.id];
    if (status) { query += ' AND status = ?'; params.push(status); }
    query += ' ORDER BY created_at DESC';
    const [goals] = await db.query(query, params);
    res.json({ success: true, goals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getGoal = async (req, res) => {
  try {
    const [goals] = await db.query('SELECT * FROM saving_goals WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (goals.length === 0) return res.status(404).json({ success: false, message: 'Goal not found' });
    res.json({ success: true, goal: goals[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createGoal = async (req, res) => {
  try {
    const { title, target_amount, deadline, category, motivation_note, wishlist_image } = req.body;
    if (!title || !target_amount || !deadline)
      return res.status(400).json({ success: false, message: 'Title, target amount, and deadline are required' });

    const [result] = await db.query(
      'INSERT INTO saving_goals (user_id, title, target_amount, deadline, category, motivation_note, wishlist_image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, title, target_amount, deadline, category || 'custom', motivation_note || null, wishlist_image || null]
    );
    const [goals] = await db.query('SELECT * FROM saving_goals WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, goal: goals[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const { title, target_amount, deadline, category, motivation_note, wishlist_image, status } = req.body;
    const [existing] = await db.query('SELECT * FROM saving_goals WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Goal not found' });

    await db.query(
      'UPDATE saving_goals SET title=?, target_amount=?, deadline=?, category=?, motivation_note=?, wishlist_image=?, status=? WHERE id=?',
      [
        title || existing[0].title,
        target_amount || existing[0].target_amount,
        deadline || existing[0].deadline,
        category || existing[0].category,
        motivation_note !== undefined ? motivation_note : existing[0].motivation_note,
        wishlist_image !== undefined ? wishlist_image : existing[0].wishlist_image,
        status || existing[0].status,
        req.params.id
      ]
    );
    const [updated] = await db.query('SELECT * FROM saving_goals WHERE id = ?', [req.params.id]);
    res.json({ success: true, goal: updated[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const [existing] = await db.query('SELECT id FROM saving_goals WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Goal not found' });
    await db.query('DELETE FROM saving_goals WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Goal deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.missedGoal = async (req, res) => {
  try {
    const { reflection_reason, recovery_option } = req.body;
    const [goals] = await db.query('SELECT * FROM saving_goals WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (goals.length === 0) return res.status(404).json({ success: false, message: 'Goal not found' });

    await db.query('UPDATE saving_goals SET status = ? WHERE id = ?', ['missed', req.params.id]);

    // Archive the missed goal
    await db.query(
      'INSERT INTO goal_archives (user_id, goal_id, title, target_amount, saved_amount, status, reflection_note) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, req.params.id, goals[0].title, goals[0].target_amount, goals[0].saved_amount, 'missed', reflection_reason || null]
    );

    // Sadden the pet
    await db.query('UPDATE pets SET happiness = GREATEST(happiness - 15, 10), mood = ? WHERE user_id = ?', ['sad', req.user.id]);

    res.json({ success: true, message: 'Goal marked as missed', recovery_option });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.completeGoal = async (req, res) => {
  try {
    const { achievement_photo, reflection_note } = req.body;
    const [goals] = await db.query('SELECT * FROM saving_goals WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (goals.length === 0) return res.status(404).json({ success: false, message: 'Goal not found' });

    await db.query('UPDATE saving_goals SET status = ? WHERE id = ?', ['completed', req.params.id]);

    // Archive
    const today = new Date().toISOString().split('T')[0];
    await db.query(
      'INSERT INTO goal_archives (user_id, goal_id, title, target_amount, saved_amount, completion_date, achievement_photo, reflection_note, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, req.params.id, goals[0].title, goals[0].target_amount, goals[0].saved_amount, today, achievement_photo || null, reflection_note || null, 'completed']
    );

    // Reward user
    const bonusCoins = 100;
    const bonusXP = 200;
    await db.query('UPDATE users SET coins = coins + ?, xp = xp + ? WHERE id = ?', [bonusCoins, bonusXP, req.user.id]);

    // Achievement badge
    await db.query(
      'INSERT INTO achievements (user_id, title, description, badge_icon, goal_id) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, `Completed: ${goals[0].title}`, `You achieved your saving goal!`, '🏆', req.params.id]
    );

    // Pet happiness boost
    await db.query('UPDATE pets SET happiness = LEAST(happiness + 20, 100), xp = xp + 50 WHERE user_id = ?', [req.user.id]);

    res.json({ success: true, message: 'Goal completed!', bonus_coins: bonusCoins, bonus_xp: bonusXP });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
