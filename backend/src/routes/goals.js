const express = require('express');
const router = express.Router();
const {
  getGoals, getGoal, createGoal, updateGoal, deleteGoal, missedGoal, completeGoal
} = require('../controllers/goalController');
const auth = require('../middleware/auth');

router.get('/', auth, getGoals);
router.get('/:id', auth, getGoal);
router.post('/', auth, createGoal);
router.put('/:id', auth, updateGoal);
router.delete('/:id', auth, deleteGoal);
router.post('/:id/missed', auth, missedGoal);
router.post('/:id/complete', auth, completeGoal);

module.exports = router;
