const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const Seat = require('../models/Seat');
const Event = require('../models/Event');

exports.reserveSeats = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { eventId, seatNumbers } = req.body;
    const userId = req.user._id;

    console.log('Reserving seats:', { eventId, seatNumbers, userId });

    if (!eventId || !seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Invalid input' });
    }

    const event = await Event.findById(eventId).session(session);
    if (!event) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Event not found' });
    }

    const seats = await Seat.find({
      eventId,
      seatNumber: { $in: seatNumbers }
    }).session(session);

    console.log('Found seats for reservation:', seats);

    if (seats.length !== seatNumbers.length) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Some seats do not exist' });
    }

    const unavailableSeats = seats.filter(seat => seat.status !== 'available');
    if (unavailableSeats.length > 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Some seats are already reserved or booked' });
    }

    const updateResult = await Seat.updateMany(
      { eventId, seatNumber: { $in: seatNumbers } },
      { $set: { status: 'reserved' } },
      { session }
    );
    console.log('Updated seats to reserved:', updateResult);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const reservation = await Reservation.create([{
      userId,
      eventId,
      seatNumbers,
      expiresAt
    }], { session });

    await session.commitTransaction();
    session.endSession();

    console.log('Reservation created successfully:', reservation[0]);
    res.status(201).json(reservation[0]);
  } catch (error) {
    console.error('Error in reserveSeats:', error);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Server error' });
  }
};
