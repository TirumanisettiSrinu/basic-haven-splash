
const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a hotel name'],
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  type: {
    type: String,
    required: [true, 'Please add a hotel type'],
    enum: ['Hotel', 'Apartment', 'Resort', 'Villa', 'Cabin']
  },
  city: {
    type: String,
    required: [true, 'Please add a city']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  distance: {
    type: String,
    required: [true, 'Please add distance from city center']
  },
  photos: {
    type: [String]
  },
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  desc: {
    type: String,
    required: [true, 'Please add a description']
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating must can not be more than 5'],
    default: 0
  },
  rooms: {
    type: [String]
  },
  cheapestPrice: {
    type: Number,
    required: [true, 'Please add a price']
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hotel', HotelSchema);
