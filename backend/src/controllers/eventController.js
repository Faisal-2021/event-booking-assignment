const Event = require('../models/Event');
const Seat = require('../models/Seat');

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().select('name venue dateTime totalSeats');
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).select('name venue dateTime totalSeats');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid event ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSeatsByEventId = async (req, res) => {
  try {
    const eventId = req.params.id;
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const seats = await Seat.find({ eventId });
    console.log('Seats fetched from DB for event:', eventId, seats.length, 'seats');
    res.status(200).json(seats);
  } catch (error) {
    console.error('Error fetching seats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
