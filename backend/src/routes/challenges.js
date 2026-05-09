const express = require('express');
const router = express.Router();
const { getChallenges, joinChallenge, completeChallenge, getUserChallenges } = require('../controllers/challengeController');
const auth = require('../middleware/auth');

router.get('/', auth, getChallenges);
router.get('/my', auth, getUserChallenges);
router.post('/join', auth, joinChallenge);
router.post('/complete', auth, completeChallenge);

module.exports = router;
