const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

// Get all orders for user
router.get('/', async (req, res) => {
  try {
    const items = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create order
router.post('/', async (req, res) => {
  try {
    const item = await Order.create({ ...req.body, userId: req.userId });
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update order
router.put('/:id', async (req, res) => {
  try {
    const item = await Order.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    const item = await Order.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
