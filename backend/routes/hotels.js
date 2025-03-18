const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const { protect } = require('../middleware/auth');

// @route   GET /api/hotels
// @desc    Get all hotels
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;
    
    let query = {};
    
    // Add price filter if provided
    if (minPrice || maxPrice) {
      query.cheapestPrice = {};
      if (minPrice) query.cheapestPrice.$gte = parseInt(minPrice);
      if (maxPrice) query.cheapestPrice.$lte = parseInt(maxPrice);
    }
    
    const hotels = await Hotel.find(query);
    res.status(200).json(hotels);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/hotels/featured
// @desc    Get featured hotels
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const hotels = await Hotel.find({ featured: true }).limit(8);
    res.status(200).json(hotels);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/hotels/:id
// @desc    Get single hotel
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: `No hotel with the id of ${req.params.id}`
      });
    }
    
    res.status(200).json(hotel);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   POST /api/hotels/search
// @desc    Search hotels
// @access  Public
router.post('/search', async (req, res) => {
  try {
    const { city, checkIn, checkOut, guests, minPrice, maxPrice } = req.body;
    
    const query = {};
    
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    
    // Add price filter
    if (minPrice || maxPrice) {
      query.cheapestPrice = {};
      if (minPrice) query.cheapestPrice.$gte = parseInt(minPrice);
      if (maxPrice) query.cheapestPrice.$lte = parseInt(maxPrice);
    }
    
    const hotels = await Hotel.find(query);
    
    // Filter hotels based on room availability and guest count
    if (checkIn && checkOut && guests) {
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);
      
      const availableHotels = [];
      
      for (const hotel of hotels) {
        // Get all rooms for this hotel
        const hotelRooms = await Room.find({
          _id: { $in: hotel.rooms }
        });
        
        // Check if any room can accommodate the guests
        const hasValidRoom = hotelRooms.some(room => {
          return room.maxPeople >= guests || (room.maxPeople * 2 >= guests); // Allow double occupancy with double price
        });
        
        if (hasValidRoom) {
          // Check availability for the dates
          let hasAvailableRoom = false;
          
          for (const room of hotelRooms) {
            if (room.maxPeople < guests && room.maxPeople * 2 < guests) continue;
            
            let isAvailable = true;
            
            for (const roomNum of room.roomNumbers) {
              // Check if room has unavailable dates that overlap with requested dates
              const isRoomUnavailable = roomNum.unavailableDates.some(date => {
                const unavailableDate = new Date(date);
                return unavailableDate >= startDate && unavailableDate <= endDate;
              });
              
              if (!isRoomUnavailable) {
                isAvailable = true;
                break;
              }
            }
            
            if (isAvailable) {
              hasAvailableRoom = true;
              break;
            }
          }
          
          if (hasAvailableRoom) {
            availableHotels.push(hotel);
          }
        }
      }
      
      return res.status(200).json(availableHotels);
    }
    
    res.status(200).json(hotels);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   POST /api/hotels
// @desc    Create new hotel
// @access  Private (Admin only)
router.post('/', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create hotels'
      });
    }
    
    const hotel = await Hotel.create(req.body);
    res.status(201).json(hotel);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   PUT /api/hotels/:id
// @desc    Update hotel
// @access  Private (Admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update hotels'
      });
    }
    
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: `No hotel with the id of ${req.params.id}`
      });
    }
    
    res.status(200).json(hotel);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   DELETE /api/hotels/:id
// @desc    Delete hotel
// @access  Private (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete hotels'
      });
    }
    
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: `No hotel with the id of ${req.params.id}`
      });
    }
    
    // Delete all rooms associated with this hotel
    await Room.deleteMany({ _id: { $in: hotel.rooms } });
    
    // Delete the hotel
    await hotel.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Hotel deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
