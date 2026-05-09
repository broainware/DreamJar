const express = require('express');
const router = express.Router();
const { addTransaction, getTransactions, deleteTransaction } = require('../controllers/transactionController');
const auth = require('../middleware/auth');

router.get('/', auth, getTransactions);
router.post('/', auth, addTransaction);
router.delete('/:id', auth, deleteTransaction);

module.exports = router;
