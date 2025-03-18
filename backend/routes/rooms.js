
const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const { protect } = require('../middleware/auth');

// @route   GET /api/rooms/hotel/:hotelId
// @desc    Get all rooms for a hotel
// @access  Public
router.get('/hotel/:hotelId', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.hotelId);
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: `No hotel with the id of ${req.params.hotelId}`
      });
    }
    
    const rooms = await Room.find({ _id: { $in: hotel.rooms } });
    
    res.status(200).json(rooms);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/rooms/:id
// @desc    Get single room
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: `No room with the id of ${req.params.id}`
      });
    }
    
    res.status(200).json(room);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/rooms/availability/:roomId
// @desc    Check room availability
// @access  Public
router.get('/availability/:roomId', async (req, res) => {
  try {
    const { dateStart, dateEnd } = req.query;
    
    if (!dateStart || !dateEnd) {
      return res.status(400).json({
        success: false,
        message: 'Please provide start and end dates'
      });
    }
    
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: `No room with the id of ${req.params.roomId}`
      });
    }
    
    const startDate = new Date(dateStart);
    const endDate = new Date(dateEnd);
    
    // Check if any room number is available for the entire date range
    const availableRoomNumbers = [];
    
    for (const roomNum of room.roomNumbers) {
      let isAvailable = true;
      
      // Check if room has unavailable dates that overlap with requested dates
      for (const date of roomNum.unavailableDates) {
        const unavailableDate = new Date(date);
        if (unavailableDate >= startDate && unavailableDate <= endDate) {
          isAvailable = false;
          break;
        }
      }
      
      if (isAvailable) {
        availableRoomNumbers.push(roomNum.number);
      }
    }
    
    res.status(200).json({
      success: true,
      available: availableRoomNumbers.length > 0,
      availableRoomNumbers
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   POST /api/rooms/:hotelId
// @desc    Create new room
// @access  Private (Admin only)
router.post('/:hotelId', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create rooms'
      });
    }
    
    const hotel = await Hotel.findById(req.params.hotelId);
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: `No hotel with the id of ${req.params.hotelId}`
      });
    }
    
    const room = await Room.create(req.body);
    
    // Add room id to hotel
    await Hotel.findByIdAndUpdate(
      req.params.hotelId,
      { $push: { rooms: room._id } }
    );
    
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   PUT /api/rooms/:id
// @desc    Update room
// @access  Private (Admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update rooms'
      });
    }
    
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: `No room with the id of ${req.params.id}`
      });
    }
    
    res.status(200).json(room);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   DELETE /api/rooms/:id/:hotelId
// @desc    Delete room
// @access  Private (Admin only)
router.delete('/:id/:hotelId', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete rooms'
      });
    }
    
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: `No room with the id of ${req.params.id}`
      });
    }
    
    // Remove room from hotel
    await Hotel.findByIdAndUpdate(
      req.params.hotelId,
      { $pull: { rooms: req.params.id } }
    );
    
    // Delete the room
    await room.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
