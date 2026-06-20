const express = require('express');
const router = express.Router();
const { createBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/bookings', protect, createBooking);

module.exports = router;
