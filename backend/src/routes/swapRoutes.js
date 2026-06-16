const express = require('express');
const router = express.Router();
const { getSwaps, createSwap, deleteSwap } = require('../controllers/swapController');

router.get('/', getSwaps);
router.post('/', createSwap);
router.delete('/:id', deleteSwap);

module.exports = router;
