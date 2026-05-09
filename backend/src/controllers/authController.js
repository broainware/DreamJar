const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields required' });

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashed]
    );
    const userId = result.insertId;

    // Create default pet
    await db.query(
      'INSERT INTO pets (user_id, name, type) VALUES (?, ?, ?)',
      [userId, 'Buddy', 'cat']
    );

    const [users] = await db.query('SELECT id, name, email, coins, xp, level, streak FROM users WHERE id = ?', [userId]);
    const token = generateToken(users[0]);

    res.status(201).json({ success: true, token, user: users[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    // Update streak and last_active
    const today = new Date().toISOString().split('T')[0];
    const lastActive = user.last_active ? user.last_active.toISOString().split('T')[0] : null;
    let newStreak = user.streak;
    if (lastActive) {
      const diff = Math.floor((new Date(today) - new Date(lastActive)) / (1000 * 60 * 60 * 24));
      if (diff === 1) newStreak += 1;
      else if (diff > 1) newStreak = 1;
    } else {
      newStreak = 1;
    }
    await db.query('UPDATE users SET last_active = ?, streak = ? WHERE id = ?', [today, newStreak, user.id]);

    const { password: _, ...userData } = user;
    userData.streak = newStreak;
    const token = generateToken(userData);

    res.json({ success: true, token, user: userData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, avatar_url, coins, xp, level, streak, last_active, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: users[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar_url } = req.body;
    await db.query('UPDATE users SET name = ?, avatar_url = ? WHERE id = ?', [name, avatar_url, req.user.id]);
    res.json({ success: true, message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
