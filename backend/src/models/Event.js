const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true
  },
  dateTime: {
    type: Date,
    required: [true, 'Event date and time are required']
  },
  venue: {
    type: String,
    required: [true, 'Event venue is required'],
    trim: true
  },
  totalSeats: {
    type: Number,
    required: [true, 'Total seats are required'],
    min: [1, 'Total seats must be at least 1']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
