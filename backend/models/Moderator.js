
const mongoose = require('mongoose');

const ModeratorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  hotelId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hotel',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  permissions: {
    canManageWorkers: {
      type: Boolean,
      default: true
    },
    canManageRooms: {
      type: Boolean,
      default: true
    },
    canViewBookings: {
      type: Boolean,
      default: true
    }
  },
  assignedHotels: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Hotel'
    }
  ]
}, {
  timestamps: true
});

// Ensure that hotelId is added to assignedHotels array
ModeratorSchema.pre('save', function(next) {
  // If this is a new moderator or the hotelId has changed
  if (this.isNew || this.isModified('hotelId')) {
    // Check if the hotelId is already in the assignedHotels array
    const hotelIdStr = this.hotelId.toString();
    const exists = this.assignedHotels.some(hotel => hotel.toString() === hotelIdStr);
    
    if (!exists) {
      this.assignedHotels.push(this.hotelId);
    }
  }
  
  next();
});

module.exports = mongoose.model('Moderator', ModeratorSchema);
