
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all users
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user with the id of ${req.params.id}`
      });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    // Make sure user is updating their own profile or is an admin
    if (req.user.id !== req.params.id && !req.user.isAdmin) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this user'
      });
    }

    // Don't allow password updates through this endpoint for security
    if (req.body.password) {
      delete req.body.password;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user with the id of ${req.params.id}`
      });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    // Make sure user is deleting their own account or is an admin
    if (req.user.id !== req.params.id && !req.user.isAdmin) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this user'
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user with the id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   POST /api/users
// @desc    Create a new user (admin only)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    // Verify that the requester is an admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create users through this endpoint'
      });
    }
    
    // Create the user
    const user = await User.create(req.body);
    
    // Remove password from response
    user.password = undefined;
    
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
