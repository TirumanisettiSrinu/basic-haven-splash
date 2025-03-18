
const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a room title'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  maxPeople: {
    type: Number,
    required: [true, 'Please add maximum number of people']
  },
  desc: {
    type: String,
    required: [true, 'Please add a description']
  },
  roomNumbers: [{ 
    number: Number, 
    unavailableDates: {
      type: [Date]
    }
  }],
  isCleaned: {
    type: Boolean,
    default: true
  },
  isAssigned: {
    type: Boolean,
    default: false
  },
  bookedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    default: null
  },
  assignedWorker: {
    type: mongoose.Schema.ObjectId,
    ref: 'Worker',
    default: null
  },
  needsCleaning: {
    type: Boolean,
    default: false
  },
  lastCleanedAt: {
    type: Date,
    default: null
  },
  cleaningHistory: [
    {
      cleanedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Worker'
      },
      cleanedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true
});

// Method to check if a room is available for a date range
RoomSchema.methods.isAvailableForDates = function(startDate, endDate) {
  // Generate array of dates to check
  const dateArray = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Check each room number for availability
  for (const roomNum of this.roomNumbers) {
    let isAvailable = true;
    
    // Check if room number has unavailable dates that overlap with requested dates
    for (const date of dateArray) {
      const dateString = date.toISOString().split('T')[0];
      
      const isUnavailable = roomNum.unavailableDates.some(unavailableDate => {
        return new Date(unavailableDate).toISOString().split('T')[0] === dateString;
      });
      
      if (isUnavailable) {
        isAvailable = false;
        break;
      }
    }
    
    if (isAvailable) {
      return {
        available: true,
        roomNumber: roomNum.number
      };
    }
  }
  
  return {
    available: false,
    roomNumber: null
  };
};

// Method to calculate dynamic price based on number of guests
RoomSchema.methods.calculatePriceForGuests = function(numberOfGuests) {
  if (numberOfGuests <= this.maxPeople) {
    return this.price;
  } else if (numberOfGuests <= this.maxPeople * 2) {
    return this.price * 2;
  } else {
    return null; // Room cannot accommodate this many guests
  }
};

module.exports = mongoose.model('Room', RoomSchema);
