const express = require('express');
const router = express.Router();
const { getHabits, createHabit, deleteHabit, analyzeHabits } = require('../controllers/habitController');
const auth = require('../middleware/auth');

router.get('/', auth, getHabits);
router.get('/analyze', auth, analyzeHabits);
router.post('/', auth, createHabit);
router.delete('/:id', auth, deleteHabit);

module.exports = router;
