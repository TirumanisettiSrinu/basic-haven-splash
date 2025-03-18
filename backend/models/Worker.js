
const mongoose = require('mongoose');

const WorkerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a worker name'],
    trim: true
  },
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
  role: {
    type: String,
    enum: ['Housekeeper', 'Receptionist', 'Manager', 'Maintenance', 'Security'],
    required: true
  },
  email: {
    type: String,
    required: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  assignedRooms: [
    {
      roomId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Room'
      }
    }
  ],
  cleanedRooms: [
    {
      roomId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Room'
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

// Middleware to ensure hotelId is linked correctly to the Hotel model
WorkerSchema.pre('save', async function(next) {
  try {
    if (this.isNew || this.isModified('hotelId')) {
      const Hotel = mongoose.model('Hotel');
      const hotel = await Hotel.findById(this.hotelId);
      
      if (!hotel) {
        throw new Error(`Hotel with id ${this.hotelId} not found`);
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Worker', WorkerSchema);
