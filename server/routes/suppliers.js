const express = require('express');
const Supplier = require('../models/Supplier');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

// Get all suppliers for user
router.get('/', async (req, res) => {
  try {
    const items = await Supplier.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create supplier
router.post('/', async (req, res) => {
  try {
    const item = await Supplier.create({ ...req.body, userId: req.userId });
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update supplier
router.put('/:id', async (req, res) => {
  try {
    const item = await Supplier.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    res.json({ success: true, item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete supplier
router.delete('/:id', async (req, res) => {
  try {
    const item = await Supplier.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
