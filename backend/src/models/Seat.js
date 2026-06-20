const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required']
  },
  seatNumber: {
    type: String,
    required: [true, 'Seat number is required'],
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['available', 'reserved', 'booked'],
      message: 'Status must be either available, reserved, or booked'
    },
    default: 'available'
  }
}, {
  timestamps: true
});

seatSchema.index({ eventId: 1, seatNumber: 1 }, { unique: true });

module.exports = mongoose.model('Seat', seatSchema);
