const db = require('../../config/db');

exports.getPet = async (req, res) => {
  try {
    const [pets] = await db.query('SELECT * FROM pets WHERE user_id = ?', [req.user.id]);
    if (pets.length === 0) return res.status(404).json({ success: false, message: 'Pet not found' });

    const pet = pets[0];
    // Decay stats over time
    const now = new Date();
    const lastFed = new Date(pet.last_fed);
    const hoursSinceFed = Math.floor((now - lastFed) / (1000 * 60 * 60));
    const hungerDecay = Math.min(hoursSinceFed * 2, 40);
    const happinessDecay = Math.min(Math.floor(hoursSinceFed / 2), 30);

    const newHunger = Math.max(pet.hunger - hungerDecay, 10);
    const newHappiness = Math.max(pet.happiness - happinessDecay, 10);

    let newMood = 'happy';
    if (newHunger < 30 || newHappiness < 30) newMood = 'sad';
    else if (newHunger < 50 || newHappiness < 50) newMood = 'neutral';

    if (hungerDecay > 0 || happinessDecay > 0) {
      await db.query('UPDATE pets SET hunger = ?, happiness = ?, mood = ? WHERE user_id = ?', [newHunger, newHappiness, newMood, req.user.id]);
      pet.hunger = newHunger;
      pet.happiness = newHappiness;
      pet.mood = newMood;
    }

    res.json({ success: true, pet });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.setupPet = async (req, res) => {
  try {
    const { name, type } = req.body;
    const [existing] = await db.query('SELECT id FROM pets WHERE user_id = ?', [req.user.id]);
    if (existing.length > 0) {
      await db.query('UPDATE pets SET name = ?, type = ? WHERE user_id = ?', [name, type, req.user.id]);
    } else {
      await db.query('INSERT INTO pets (user_id, name, type) VALUES (?, ?, ?)', [req.user.id, name, type]);
    }
    const [pets] = await db.query('SELECT * FROM pets WHERE user_id = ?', [req.user.id]);
    res.json({ success: true, pet: pets[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.feedPet = async (req, res) => {
  try {
    const [pets] = await db.query('SELECT * FROM pets WHERE user_id = ?', [req.user.id]);
    if (pets.length === 0) return res.status(404).json({ success: false, message: 'Pet not found' });

    const [users] = await db.query('SELECT coins FROM users WHERE id = ?', [req.user.id]);
    if (users[0].coins < 10) return res.status(400).json({ success: false, message: 'Not enough coins to feed pet' });

    await db.query('UPDATE users SET coins = coins - 10 WHERE id = ?', [req.user.id]);
    await db.query(
      'UPDATE pets SET hunger = LEAST(hunger + 30, 100), happiness = LEAST(happiness + 5, 100), mood = ?, last_fed = NOW() WHERE user_id = ?',
      ['happy', req.user.id]
    );

    res.json({ success: true, message: 'Pet fed! 🍖', coins_spent: 10 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.playWithPet = async (req, res) => {
  try {
    const [pets] = await db.query('SELECT * FROM pets WHERE user_id = ?', [req.user.id]);
    if (pets.length === 0) return res.status(404).json({ success: false, message: 'Pet not found' });

    if (pets[0].energy < 20) return res.status(400).json({ success: false, message: 'Pet is too tired to play!' });

    await db.query(
      'UPDATE pets SET happiness = LEAST(happiness + 20, 100), energy = GREATEST(energy - 15, 0), mood = ?, last_played = NOW() WHERE user_id = ?',
      ['happy', req.user.id]
    );

    res.json({ success: true, message: 'Played with pet! 🎾' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.sleepPet = async (req, res) => {
  try {
    await db.query('UPDATE pets SET energy = 100, mood = ? WHERE user_id = ?', ['sleeping', req.user.id]);
    res.json({ success: true, message: 'Pet is sleeping... 💤' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getInventory = async (req, res) => {
  try {
    const [items] = await db.query('SELECT * FROM pet_inventory WHERE user_id = ?', [req.user.id]);
    res.json({ success: true, inventory: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.equipItem = async (req, res) => {
  try {
    const { item_id } = req.body;
    const [items] = await db.query('SELECT * FROM pet_inventory WHERE id = ? AND user_id = ?', [item_id, req.user.id]);
    if (items.length === 0) return res.status(404).json({ success: false, message: 'Item not found' });

    // Unequip same type
    await db.query('UPDATE pet_inventory SET is_equipped = FALSE WHERE user_id = ? AND item_type = ?', [req.user.id, items[0].item_type]);
    await db.query('UPDATE pet_inventory SET is_equipped = TRUE WHERE id = ?', [item_id]);

    res.json({ success: true, message: 'Item equipped!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
