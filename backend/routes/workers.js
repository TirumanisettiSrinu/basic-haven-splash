
const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');
const User = require('../models/User');
const Room = require('../models/Room');
const { protect } = require('../middleware/auth');

// @route   GET /api/workers
// @desc    Get all workers
// @access  Private (Admin or Moderator)
router.get('/', protect, async (req, res) => {
  try {
    // Check if user is admin or moderator
    if (!req.user.isAdmin && !req.user.isModerator) {
      return res.status(403).json({
        success: false,
        message: 'Only admins or moderators can view workers'
      });
    }
    
    let query = {};
    
    // If moderator, only show workers for their hotel
    if (req.user.isModerator && !req.user.isAdmin) {
      // Get the moderator's hotel ID
      const moderator = await Moderator.findOne({ userId: req.user.id });
      if (moderator) {
        query.hotelId = moderator.hotelId;
      }
    }
    
    const workers = await Worker.find(query)
      .populate('userId', 'username email')
      .populate('hotelId', 'name');
    
    res.status(200).json(workers);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/workers/:id
// @desc    Get single worker
// @access  Private (Admin or Moderator)
router.get('/:id', protect, async (req, res) => {
  try {
    // Check if user is admin or moderator
    if (!req.user.isAdmin && !req.user.isModerator) {
      return res.status(403).json({
        success: false,
        message: 'Only admins or moderators can view worker details'
      });
    }
    
    const worker = await Worker.findById(req.params.id)
      .populate('userId', 'username email')
      .populate('hotelId', 'name')
      .populate('assignedRooms.roomId', 'title roomNumbers');
    
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: `No worker with the id of ${req.params.id}`
      });
    }
    
    // If moderator, check if worker belongs to their hotel
    if (req.user.isModerator && !req.user.isAdmin) {
      const moderator = await Moderator.findOne({ userId: req.user.id });
      if (moderator && worker.hotelId.toString() !== moderator.hotelId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this worker'
        });
      }
    }
    
    res.status(200).json(worker);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   POST /api/workers
// @desc    Create worker
// @access  Private (Admin or Moderator)
router.post('/', protect, async (req, res) => {
  try {
    // Check if user is admin or moderator
    if (!req.user.isAdmin && !req.user.isModerator) {
      return res.status(403).json({
        success: false,
        message: 'Only admins or moderators can create workers'
      });
    }
    
    const { name, email, role, phone, hotelId, assignedRooms } = req.body;
    
    // Create user for worker if not exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Generate a random password
      const password = Math.random().toString(36).slice(-8);
      
      user = await User.create({
        username: name.replace(/\s+/g, '').toLowerCase(), // Generate username from name
        email,
        password,
        country: 'Unknown', // Default values
        city: 'Unknown',
        phone,
        isAdmin: false,
        isModerator: false
      });
    }
    
    // If moderator, check if they can create worker for this hotel
    if (req.user.isModerator && !req.user.isAdmin) {
      const moderator = await Moderator.findOne({ userId: req.user.id });
      if (moderator && moderator.hotelId.toString() !== hotelId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to create worker for this hotel'
        });
      }
    }
    
    // Create worker
    const worker = await Worker.create({
      name,
      userId: user._id,
      hotelId,
      role,
      email,
      phone,
      isActive: true,
      assignedRooms: assignedRooms || []
    });
    
    res.status(201).json(worker);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   PUT /api/workers/:id
// @desc    Update worker
// @access  Private (Admin or Moderator)
router.put('/:id', protect, async (req, res) => {
  try {
    // Check if user is admin or moderator
    if (!req.user.isAdmin && !req.user.isModerator) {
      return res.status(403).json({
        success: false,
        message: 'Only admins or moderators can update workers'
      });
    }
    
    // Check if worker exists
    let worker = await Worker.findById(req.params.id);
    
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: `No worker with the id of ${req.params.id}`
      });
    }
    
    // If moderator, check if they can update this worker
    if (req.user.isModerator && !req.user.isAdmin) {
      const moderator = await Moderator.findOne({ userId: req.user.id });
      if (moderator && worker.hotelId.toString() !== moderator.hotelId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this worker'
        });
      }
    }
    
    // Update worker
    worker = await Worker.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(worker);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   DELETE /api/workers/:id
// @desc    Delete worker
// @access  Private (Admin or Moderator)
router.delete('/:id', protect, async (req, res) => {
  try {
    // Check if user is admin or moderator
    if (!req.user.isAdmin && !req.user.isModerator) {
      return res.status(403).json({
        success: false,
        message: 'Only admins or moderators can delete workers'
      });
    }
    
    // Check if worker exists
    const worker = await Worker.findById(req.params.id);
    
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: `No worker with the id of ${req.params.id}`
      });
    }
    
    // If moderator, check if they can delete this worker
    if (req.user.isModerator && !req.user.isAdmin) {
      const moderator = await Moderator.findOne({ userId: req.user.id });
      if (moderator && worker.hotelId.toString() !== moderator.hotelId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this worker'
        });
      }
    }
    
    // Delete worker (don't delete associated user)
    await worker.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Worker deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   PUT /api/workers/:id/rooms/:roomId/clean
// @desc    Mark room as cleaned by worker
// @access  Private (Worker, Admin, or Moderator)
router.put('/:id/rooms/:roomId/clean', protect, async (req, res) => {
  try {
    // Check if the user is the worker, an admin, or a moderator
    const worker = await Worker.findById(req.params.id);
    
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: `No worker with the id of ${req.params.id}`
      });
    }
    
    const isAuthorized = 
      req.user.isAdmin || 
      req.user.isModerator || 
      worker.userId.toString() === req.user.id;
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update room status'
      });
    }
    
    // Check if room is assigned to worker
    const isRoomAssigned = worker.assignedRooms.some(
      room => room.roomId.toString() === req.params.roomId
    );
    
    if (!isRoomAssigned && !req.user.isAdmin && !req.user.isModerator) {
      return res.status(403).json({
        success: false,
        message: 'This room is not assigned to the worker'
      });
    }
    
    // Update room to mark as cleaned
    const room = await Room.findByIdAndUpdate(
      req.params.roomId,
      { isCleaned: true },
      { new: true }
    );
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: `No room with the id of ${req.params.roomId}`
      });
    }
    
    res.status(200).json({
      success: true,
      room
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
