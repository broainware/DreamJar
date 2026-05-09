const db = require('../../config/db');

exports.getHabits = async (req, res) => {
  try {
    const [habits] = await db.query('SELECT * FROM habits WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json({ success: true, habits });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createHabit = async (req, res) => {
  try {
    const { habit_name, cost, frequency } = req.body;
    if (!habit_name || !cost) return res.status(400).json({ success: false, message: 'habit_name and cost are required' });
    const [result] = await db.query(
      'INSERT INTO habits (user_id, habit_name, cost, frequency) VALUES (?, ?, ?, ?)',
      [req.user.id, habit_name, cost, frequency || 'daily']
    );
    const [habits] = await db.query('SELECT * FROM habits WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, habit: habits[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteHabit = async (req, res) => {
  try {
    await db.query('DELETE FROM habits WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ success: true, message: 'Habit deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.analyzeHabits = async (req, res) => {
  try {
    const { goal_id } = req.query;
    const [habits] = await db.query('SELECT * FROM habits WHERE user_id = ?', [req.user.id]);

    let goalInfo = null;
    if (goal_id) {
      const [goals] = await db.query('SELECT * FROM saving_goals WHERE id = ? AND user_id = ?', [goal_id, req.user.id]);
      if (goals.length > 0) goalInfo = goals[0];
    }

    const analysis = habits.map(h => {
      let dailyCost = h.cost;
      if (h.frequency === 'weekly') dailyCost = h.cost / 7;
      if (h.frequency === 'monthly') dailyCost = h.cost / 30;

      let daysToSave = null;
      if (goalInfo) {
        const remaining = goalInfo.target_amount - goalInfo.saved_amount;
        if (dailyCost > 0) daysToSave = Math.ceil(remaining / dailyCost);
      }

      return {
        ...h,
        daily_cost: dailyCost,
        monthly_cost: dailyCost * 30,
        yearly_cost: dailyCost * 365,
        days_to_achieve_goal: daysToSave,
      };
    });

    const totalDailySavings = analysis.reduce((s, h) => s + h.daily_cost, 0);
    res.json({ success: true, habits: analysis, total_daily_savings_possible: totalDailySavings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
