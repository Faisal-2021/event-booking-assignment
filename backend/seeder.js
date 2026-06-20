require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./src/models/Event');
const Seat = require('./src/models/Seat');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    await Event.deleteMany();
    await Seat.deleteMany();
    console.log('Existing data cleared');

    const events = [
      {
        name: 'Music Concert',
        venue: 'City Stadium',
        dateTime: new Date('2025-08-15T20:00:00Z'),
        totalSeats: 50
      },
      {
        name: 'Tech Conference',
        venue: 'Convention Center',
        dateTime: new Date('2025-09-20T09:00:00Z'),
        totalSeats: 50
      },
      {
        name: 'Comedy Show',
        venue: 'Stand-up Club',
        dateTime: new Date('2025-10-05T19:30:00Z'),
        totalSeats: 50
      }
    ];

    const createdEvents = await Event.create(events);
    console.log('Events created');

    const rows = ['A', 'B', 'C', 'D', 'E'];
    const seatsToCreate = [];

    for (const event of createdEvents) {
      for (const row of rows) {
        for (let i = 1; i <= 10; i++) {
          seatsToCreate.push({
            eventId: event._id,
            seatNumber: `${row}${i}`,
            status: 'available'
          });
        }
      }
    }

    await Seat.create(seatsToCreate);
    console.log('Seats created');

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
