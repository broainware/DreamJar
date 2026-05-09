const express = require('express');
const router = express.Router();
const { getPet, setupPet, feedPet, playWithPet, sleepPet, getInventory, equipItem } = require('../controllers/petController');
const auth = require('../middleware/auth');

router.get('/', auth, getPet);
router.post('/setup', auth, setupPet);
router.post('/feed', auth, feedPet);
router.post('/play', auth, playWithPet);
router.post('/sleep', auth, sleepPet);
router.get('/inventory', auth, getInventory);
router.post('/equip', auth, equipItem);

module.exports = router;
