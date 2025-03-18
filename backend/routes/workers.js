
const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const { protect } = require('../middleware/auth');

// @route   GET /api/workers
// @desc    Get all workers
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // If user is admin, return all workers
    // If user is moderator, return only workers for hotels they moderate
    let query = {};
    
    if (!req.user.isAdmin) {
      // Find hotels this moderator has access to
      const hotels = await Hotel.find({ rooms: { $exists: true } });
      const hotelIds = hotels.map(hotel => hotel._id);
      
      if (hotelIds.length === 0) {
        return res.status(200).json([]);
      }
      
      query.hotelId = { $in: hotelIds };
    }
    
    const workers = await Worker.find(query);
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
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: `No worker with the id of ${req.params.id}`
      });
    }
    
    // Check if user has access to this worker's hotel
    if (!req.user.isAdmin && worker.hotelId.toString() !== req.user.hotelId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this worker'
      });
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
        message: 'Not authorized to create workers'
      });
    }
    
    // Create worker
    const worker = await Worker.create({
      ...req.body,
      userId: req.body.userId || req.user.id // Use logged in user ID if not specified
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
        message: 'Not authorized to update workers'
      });
    }
    
    const worker = await Worker.findById(req.params.id);
    
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: `No worker with the id of ${req.params.id}`
      });
    }
    
    // If not admin, check if user has access to this worker's hotel
    if (!req.user.isAdmin && worker.hotelId.toString() !== req.body.hotelId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this worker'
      });
    }
    
    // Update worker
    const updatedWorker = await Worker.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedWorker);
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
        message: 'Not authorized to delete workers'
      });
    }
    
    const worker = await Worker.findById(req.params.id);
    
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: `No worker with the id of ${req.params.id}`
      });
    }
    
    // If not admin, check if user has access to this worker's hotel
    if (!req.user.isAdmin) {
      const hotel = await Hotel.findById(worker.hotelId);
      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: `No hotel found for this worker`
        });
      }
    }
    
    // Delete worker
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

// @route   PUT /api/workers/:workerId/rooms/:roomId/clean
// @desc    Mark room as cleaned by worker
// @access  Private (Admin or Moderator)
router.put('/:workerId/rooms/:roomId/clean', protect, async (req, res) => {
  try {
    // Check if user is admin or moderator
    if (!req.user.isAdmin && !req.user.isModerator) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    const worker = await Worker.findById(req.params.workerId);
    
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: `No worker with the id of ${req.params.workerId}`
      });
    }
    
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: `No room with the id of ${req.params.roomId}`
      });
    }
    
    // Add room to worker's cleaned rooms
    const now = new Date();
    worker.cleanedRooms.push({
      roomId: req.params.roomId,
      cleanedAt: now
    });
    
    await worker.save();
    
    // Update room status
    room.isCleaned = true;
    room.needsCleaning = false;
    room.lastCleanedAt = now;
    room.cleaningHistory.push({
      cleanedBy: req.params.workerId,
      cleanedAt: now
    });
    
    await room.save();
    
    res.status(200).json({
      success: true,
      message: 'Room marked as cleaned'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
