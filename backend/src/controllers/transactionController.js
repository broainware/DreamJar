const db = require('../../config/db');

exports.addTransaction = async (req, res) => {
  try {
    const { goal_id, amount, date, note } = req.body;
    if (!goal_id || !amount || !date)
      return res.status(400).json({ success: false, message: 'goal_id, amount, and date are required' });

    const [goals] = await db.query('SELECT * FROM saving_goals WHERE id = ? AND user_id = ?', [goal_id, req.user.id]);
    if (goals.length === 0) return res.status(404).json({ success: false, message: 'Goal not found' });

    const goal = goals[0];
    const coinsEarned = Math.floor(amount / 1000) + 5;
    const xpEarned = Math.floor(amount / 500) + 10;

    const [result] = await db.query(
      'INSERT INTO saving_transactions (goal_id, user_id, amount, date, note, coins_earned, xp_earned) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [goal_id, req.user.id, amount, date, note || null, coinsEarned, xpEarned]
    );

    // Update saved_amount
    const newSaved = parseFloat(goal.saved_amount) + parseFloat(amount);
    let newStatus = goal.status;
    if (newSaved >= goal.target_amount) newStatus = 'completed';

    await db.query('UPDATE saving_goals SET saved_amount = ?, status = ? WHERE id = ?', [newSaved, newStatus, goal_id]);

    // Update user coins and xp
    await db.query('UPDATE users SET coins = coins + ?, xp = xp + ? WHERE id = ?', [coinsEarned, xpEarned, req.user.id]);

    // Update pet stats
    await db.query(
      'UPDATE pets SET hunger = LEAST(hunger + 10, 100), happiness = LEAST(happiness + 5, 100), xp = xp + ? WHERE user_id = ?',
      [xpEarned, req.user.id]
    );

    const [tx] = await db.query('SELECT * FROM saving_transactions WHERE id = ?', [result.insertId]);
    res.status(201).json({
      success: true,
      transaction: tx[0],
      coins_earned: coinsEarned,
      xp_earned: xpEarned,
      goal_completed: newStatus === 'completed'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { goal_id } = req.query;
    let query = 'SELECT * FROM saving_transactions WHERE user_id = ?';
    const params = [req.user.id];
    if (goal_id) { query += ' AND goal_id = ?'; params.push(goal_id); }
    query += ' ORDER BY date DESC, created_at DESC';
    const [transactions] = await db.query(query, params);
    res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const [tx] = await db.query('SELECT * FROM saving_transactions WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (tx.length === 0) return res.status(404).json({ success: false, message: 'Transaction not found' });

    await db.query('UPDATE saving_goals SET saved_amount = GREATEST(saved_amount - ?, 0) WHERE id = ?', [tx[0].amount, tx[0].goal_id]);
    await db.query('DELETE FROM saving_transactions WHERE id = ?', [req.params.id]);

    res.json({ success: true, message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
