const express = require('express');
const Purchase = require('../models/Purchase');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

// Get all purchases for user
router.get('/', async (req, res) => {
  try {
    const items = await Purchase.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Record new purchase
router.post('/', async (req, res) => {
  try {
    const item = await Purchase.create({ ...req.body, userId: req.userId });
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete purchase
router.delete('/:id', async (req, res) => {
  try {
    const item = await Purchase.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Purchase not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
