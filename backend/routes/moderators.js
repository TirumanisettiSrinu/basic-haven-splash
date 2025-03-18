
const express = require('express');
const router = express.Router();
const Moderator = require('../models/Moderator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/moderators
// @desc    Get all moderators
// @access  Private (Admin only)
router.get('/', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can view all moderators'
      });
    }
    
    const moderators = await Moderator.find()
      .populate('userId', 'username email')
      .populate('hotelId', 'name');
    
    res.status(200).json(moderators);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/moderators/:id
// @desc    Get single moderator
// @access  Private (Admin only)
router.get('/:id', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can view moderator details'
      });
    }
    
    const moderator = await Moderator.findById(req.params.id)
      .populate('userId', 'username email')
      .populate('hotelId', 'name');
    
    if (!moderator) {
      return res.status(404).json({
        success: false,
        message: `No moderator with the id of ${req.params.id}`
      });
    }
    
    res.status(200).json(moderator);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   POST /api/moderators
// @desc    Create moderator
// @access  Private (Admin only)
router.post('/', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create moderators'
      });
    }
    
    const { userId, hotelId, permissions } = req.body;
    
    // Check if user exists
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user with the id of ${userId}`
      });
    }
    
    // Check if moderator for this user already exists
    let moderator = await Moderator.findOne({ userId });
    
    if (moderator) {
      return res.status(400).json({
        success: false,
        message: 'Moderator with this user already exists'
      });
    }
    
    // Update user to have moderator role
    await User.findByIdAndUpdate(userId, { isModerator: true });
    
    // Create moderator
    moderator = await Moderator.create({
      userId,
      hotelId,
      isActive: true,
      permissions: permissions || {
        canManageWorkers: true,
        canManageRooms: true,
        canViewBookings: true
      }
    });
    
    res.status(201).json(moderator);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   PUT /api/moderators/:id
// @desc    Update moderator
// @access  Private (Admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update moderators'
      });
    }
    
    const moderator = await Moderator.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!moderator) {
      return res.status(404).json({
        success: false,
        message: `No moderator with the id of ${req.params.id}`
      });
    }
    
    res.status(200).json(moderator);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   DELETE /api/moderators/:id
// @desc    Delete moderator
// @access  Private (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete moderators'
      });
    }
    
    const moderator = await Moderator.findById(req.params.id);
    
    if (!moderator) {
      return res.status(404).json({
        success: false,
        message: `No moderator with the id of ${req.params.id}`
      });
    }
    
    // Remove moderator role from user
    await User.findByIdAndUpdate(moderator.userId, { isModerator: false });
    
    // Delete moderator
    await moderator.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Moderator deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
