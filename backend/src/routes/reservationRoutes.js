const express = require('express');
const router = express.Router();
const { reserveSeats } = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/reservations', protect, reserveSeats);

module.exports = router;
