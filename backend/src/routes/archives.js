const express = require('express');
const router = express.Router();
const { getArchives, getAchievements } = require('../controllers/archiveController');
const auth = require('../middleware/auth');

router.get('/', auth, getArchives);
router.get('/achievements', auth, getAchievements);

module.exports = router;
