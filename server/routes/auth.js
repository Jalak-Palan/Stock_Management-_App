const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Helper to format user response (exclude password)
const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  businessName: user.businessName,
  email: user.email,
  phone: user.phone,
  image: user.image,
  address: user.address,
  city: user.city,
  state: user.state,
  country: user.country,
  pincode: user.pincode,
});

// Register
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      businessName,
      email,
      password,
      phone,
      image,
      address,
      city,
      state,
      country,
      pincode,
    } = req.body;

    if (!email || !password || !name || !businessName) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      businessName,
      email: cleanEmail,
      password: hashedPassword,
      phone,
      image,
      address,
      city,
      state,
      country,
      pincode,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: formatUserResponse(newUser),
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    );

    res.json({
      success: true,
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and new password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email address' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error during password reset' });
  }
});

// Update Profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const {
      name,
      businessName,
      email,
      phone,
      image,
      address,
      city,
      state,
      country,
      pincode,
    } = req.body;

    if (email && email !== currentUser.email) {
      const cleanEmail = email.trim().toLowerCase();
      const emailExists = await User.findOne({ email: cleanEmail });
      if (emailExists && emailExists._id.toString() !== currentUser._id.toString()) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      currentUser.email = cleanEmail;
    }

    if (name !== undefined) currentUser.name = name;
    if (businessName !== undefined) currentUser.businessName = businessName;
    if (phone !== undefined) currentUser.phone = phone;
    if (image !== undefined) currentUser.image = image;
    if (address !== undefined) currentUser.address = address;
    if (city !== undefined) currentUser.city = city;
    if (state !== undefined) currentUser.state = state;
    if (country !== undefined) currentUser.country = country;
    if (pincode !== undefined) currentUser.pincode = pincode;

    await currentUser.save();

    res.json({
      success: true,
      user: formatUserResponse(currentUser),
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating profile' });
  }
});

module.exports = router;
