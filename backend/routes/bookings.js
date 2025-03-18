const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { protect } = require('../middleware/auth');

// @route   GET /api/bookings
// @desc    Get all bookings
// @access  Private (Admin only)
router.get('/', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin && !req.user.isModerator) {
      return res.status(403).json({
        success: false,
        message: 'Only admins or moderators can view all bookings'
      });
    }
    
    const bookings = await Booking.find()
      .populate('userId', 'username email')
      .populate('hotelId', 'name city')
      .populate('roomId', 'title');
    
    res.status(200).json(bookings);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/bookings/hotel/:hotelId
// @desc    Get all bookings for a hotel
// @access  Private (Admin or Moderator)
router.get('/hotel/:hotelId', protect, async (req, res) => {
  try {
    // Check if user is admin or moderator
    if (!req.user.isAdmin && !req.user.isModerator) {
      return res.status(403).json({
        success: false,
        message: 'Only admins or moderators can view hotel bookings'
      });
    }
    
    const bookings = await Booking.find({ hotelId: req.params.hotelId })
      .populate('userId', 'username email')
      .populate('hotelId', 'name city')
      .populate('roomId', 'title');
    
    res.status(200).json(bookings);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/bookings/user/:userId
// @desc    Get all bookings for a user
// @access  Private
router.get('/user/:userId', protect, async (req, res) => {
  try {
    // Check if user is getting their own bookings or is an admin
    if (req.user.id !== req.params.userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these bookings'
      });
    }
    
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate('hotelId', 'name city photos')
      .populate('roomId', 'title price');
    
    res.status(200).json(bookings);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   POST /api/bookings
// @desc    Create a booking
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { hotelId, roomId, roomNumber, dateStart, dateEnd, totalPrice } = req.body;
    
    // Set userId from authenticated user
    const userId = req.user.id;
    
    // Check if room exists
    const room = await Room.findById(roomId);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    // Check if room number exists in the room
    const roomNumberObj = room.roomNumbers.find(r => r.number === roomNumber);
    
    if (!roomNumberObj) {
      return res.status(404).json({
        success: false,
        message: 'Room number not found'
      });
    }
    
    // Check if room is available for the requested dates
    const startDate = new Date(dateStart);
    const endDate = new Date(dateEnd);
    
    // Generate array of dates between start and end
    const dateArray = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Check for overlapping dates
    for (const date of dateArray) {
      const isUnavailable = roomNumberObj.unavailableDates.some(unavailableDate => {
        return new Date(unavailableDate).toDateString() === date.toDateString();
      });
      
      if (isUnavailable) {
        return res.status(400).json({
          success: false,
          message: 'Room is not available for the selected dates'
        });
      }
    }
    
    // Create booking
    const booking = await Booking.create({
      userId,
      hotelId,
      roomId,
      roomNumber,
      dateStart,
      dateEnd,
      totalPrice,
      status: 'confirmed'
    });
    
    // Update room unavailable dates
    await Room.updateOne(
      { "roomNumbers.number": roomNumber },
      {
        $push: {
          "roomNumbers.$.unavailableDates": dateArray
        }
      }
    );
    
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if user is canceling their own booking or is an admin
    if (booking.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }
    
    // Check if booking is already cancelled or completed
    if (booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: `Booking cannot be cancelled (current status: ${booking.status})`
      });
    }
    
    // Update booking status
    booking.status = 'cancelled';
    await booking.save();
    
    // Remove unavailable dates from room
    const startDate = new Date(booking.dateStart);
    const endDate = new Date(booking.dateEnd);
    
    // Generate array of dates between start and end
    const dateArray = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Remove dates from room
    for (const date of dateArray) {
      await Room.updateOne(
        { "roomNumbers.number": booking.roomNumber },
        {
          $pull: {
            "roomNumbers.$.unavailableDates": {
              $gte: date,
              $lte: date
            }
          }
        }
      );
    }
    
    // Mark the room as needing cleaning
    await Room.findByIdAndUpdate(
      booking.roomId,
      { 
        needsCleaning: true,
        isCleaned: false
      }
    );
    
    res.status(200).json(booking);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/bookings/:id/receipt
// @desc    Get booking receipt data
// @access  Private
router.get('/:id/receipt', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check authorization
    if (booking.userId.toString() !== req.user.id && !req.user.isAdmin && !req.user.isModerator) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this receipt'
      });
    }
    
    // Get related data
    const hotel = await Hotel.findById(booking.hotelId, 'name address city');
    const room = await Room.findById(booking.roomId, 'title price');
    const user = await User.findById(booking.userId, 'username email phone');
    
    if (!hotel || !room || !user) {
      return res.status(404).json({
        success: false,
        message: 'Some booking data not found'
      });
    }
    
    // Construct receipt data
    const receiptData = {
      booking,
      hotel,
      room,
      user
    };
    
    res.status(200).json(receiptData);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
