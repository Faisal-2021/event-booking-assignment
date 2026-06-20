const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const Seat = require('../models/Seat');

exports.createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { reservationId } = req.body;
    const userId = req.user._id;

    console.log('Creating booking for reservation:', reservationId, userId);

    if (!reservationId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Reservation ID is required' });
    }

    const reservation = await Reservation.findById(reservationId).session(session);
    if (!reservation) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Reservation not found' });
    }

    console.log('Found reservation:', reservation);

    if (reservation.userId.toString() !== userId.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (new Date() > reservation.expiresAt) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Reservation has expired' });
    }

    const updateResult = await Seat.updateMany(
      { eventId: reservation.eventId, seatNumber: { $in: reservation.seatNumbers } },
      { $set: { status: 'booked' } },
      { session }
    );
    console.log('Updated seats to booked:', updateResult);

    await Reservation.findByIdAndDelete(reservationId).session(session);

    await session.commitTransaction();
    session.endSession();

    console.log('Booking successful');
    res.status(200).json({
      success: true,
      message: 'Booking successful'
    });
  } catch (error) {
    console.error('Error in createBooking:', error);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Server error' });
  }
};
