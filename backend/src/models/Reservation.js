const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required']
  },
  seatNumbers: [{
    type: String,
    required: [true, 'Seat numbers are required'],
    trim: true
  }],
  expiresAt: {
    type: Date,
    required: [true, 'Expiration time is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reservation', reservationSchema);
