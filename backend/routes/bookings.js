
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const { protect } = require('../middleware/auth');

// @route   GET /api/bookings
// @desc    Get all bookings (admin/moderator)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Check if user is admin or moderator
    if (!req.user.isAdmin && !req.user.isModerator) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view all bookings'
      });
    }
    
    let query = {};
    
    // If moderator, only show bookings for hotels they moderate
    if (req.user.isModerator && !req.user.isAdmin) {
      // Get hotels moderated by this user
      const hotels = await Hotel.find();
      const hotelIds = hotels.map(hotel => hotel._id);
      
      if (hotelIds.length === 0) {
        return res.status(200).json([]);
      }
      
      query.hotelId = { $in: hotelIds };
    }
    
    const bookings = await Booking.find(query)
      .populate('userId', 'username email')
      .populate('hotelId', 'name')
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
// @desc    Get bookings for a user
// @access  Private
router.get('/user/:userId', protect, async (req, res) => {
  try {
    // Check if user is requesting their own bookings or is admin
    if (req.user.id !== req.params.userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these bookings'
      });
    }
    
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate('hotelId', 'name photos')
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
// @desc    Get bookings for a hotel
// @access  Private (Admin or Moderator)
router.get('/hotel/:hotelId', protect, async (req, res) => {
  try {
    // Check if user is admin or moderator
    if (!req.user.isAdmin && !req.user.isModerator) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view hotel bookings'
      });
    }
    
    const bookings = await Booking.find({ hotelId: req.params.hotelId })
      .populate('userId', 'username email')
      .populate('roomId', 'title');
    
    res.status(200).json(bookings);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get a single booking
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'username email')
      .populate('hotelId', 'name photos')
      .populate('roomId', 'title');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`
      });
    }
    
    // Check if user is booking owner, admin, or moderator of the hotel
    if (
      req.user.id !== booking.userId._id.toString() && 
      !req.user.isAdmin && 
      !req.user.isModerator
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }
    
    res.status(200).json(booking);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/bookings/:id/receipt
// @desc    Get a booking receipt
// @access  Private
router.get('/:id/receipt', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'username email')
      .populate('hotelId', 'name address')
      .populate('roomId', 'title');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`
      });
    }
    
    // Check if user is booking owner, admin, or moderator of the hotel
    if (
      req.user.id !== booking.userId._id.toString() && 
      !req.user.isAdmin && 
      !req.user.isModerator
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this receipt'
      });
    }
    
    res.status(200).json({
      booking,
      receipt: booking.receipt
    });
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
    const { roomId, dateStart, dateEnd, roomNumber } = req.body;
    
    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: `No room with the id of ${roomId}`
      });
    }
    
    // Check room availability for the requested dates
    const requestedDates = [];
    const currentDate = new Date(dateStart);
    const endDate = new Date(dateEnd);
    
    while (currentDate <= endDate) {
      requestedDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Find the room number object
    const roomNumberObj = room.roomNumbers.find(r => r.number === parseInt(roomNumber));
    
    if (!roomNumberObj) {
      return res.status(400).json({
        success: false,
        message: `Room number ${roomNumber} not found`
      });
    }
    
    // Check if the room is available for all requested dates
    for (const date of requestedDates) {
      const formattedDate = date.toISOString().split('T')[0];
      
      // Check if the date is in unavailable dates
      const isUnavailable = roomNumberObj.unavailableDates.some(
        unavailDate => new Date(unavailDate).toISOString().split('T')[0] === formattedDate
      );
      
      if (isUnavailable) {
        return res.status(400).json({
          success: false,
          message: `Room is not available for the requested dates`
        });
      }
    }
    
    // Calculate booking duration in days
    const durationInMs = new Date(dateEnd).getTime() - new Date(dateStart).getTime();
    const durationInDays = Math.ceil(durationInMs / (1000 * 60 * 60 * 24));
    
    // Calculate total price
    const totalPrice = room.price * durationInDays;
    
    // Create booking
    const booking = await Booking.create({
      userId: req.user.id,
      hotelId: req.body.hotelId,
      roomId,
      roomNumber,
      dateStart,
      dateEnd,
      totalPrice,
      status: 'confirmed'
    });
    
    // Update room availability
    for (const date of requestedDates) {
      roomNumberObj.unavailableDates.push(date);
    }
    
    await room.save();
    
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   PUT /api/bookings/:id
// @desc    Update a booking
// @access  Private (Admin or Moderator)
router.put('/:id', protect, async (req, res) => {
  try {
    // Check if user is admin or moderator
    if (!req.user.isAdmin && !req.user.isModerator) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update bookings'
      });
    }
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`
      });
    }
    
    // Update booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedBooking);
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
        message: `No booking with the id of ${req.params.id}`
      });
    }
    
    // Check if user is booking owner, admin, or moderator
    if (
      req.user.id !== booking.userId.toString() && 
      !req.user.isAdmin && 
      !req.user.isModerator
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }
    
    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already cancelled'
      });
    }
    
    // Update booking status
    booking.status = 'cancelled';
    await booking.save();
    
    // Remove booking dates from room unavailable dates
    const room = await Room.findById(booking.roomId);
    
    if (room) {
      const roomNumber = room.roomNumbers.find(r => r.number === booking.roomNumber);
      
      if (roomNumber) {
        const bookingStartDate = new Date(booking.dateStart);
        const bookingEndDate = new Date(booking.dateEnd);
        
        // Filter out dates that fall within the booking period
        roomNumber.unavailableDates = roomNumber.unavailableDates.filter(date => {
          const unavailableDate = new Date(date);
          return unavailableDate < bookingStartDate || unavailableDate > bookingEndDate;
        });
        
        await room.save();
      }
    }
    
    res.status(200).json(booking);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Delete a booking
// @access  Private (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete bookings'
      });
    }
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`
      });
    }
    
    // Delete booking
    await booking.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
