
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
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
  roomId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
    required: true
  },
  roomNumber: {
    type: Number,
    required: true
  },
  dateStart: {
    type: Date,
    required: true
  },
  dateEnd: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed', 'confirmed'],
    default: 'active'
  },
  receipt: {
    issueDate: {
      type: Date,
      default: Date.now
    },
    receiptNumber: {
      type: String
    }
  }
}, {
  timestamps: true
});

// Generate a receipt number when a booking is created
BookingSchema.pre('save', function(next) {
  if (this.isNew) {
    const timestamp = new Date().getTime();
    const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.receipt.receiptNumber = `INV-${timestamp}-${randomPart}`;
  }
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);
