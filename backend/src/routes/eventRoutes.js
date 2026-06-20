const express = require('express');
const router = express.Router();
const { getEvents, getEventById, getSeatsByEventId } = require('../controllers/eventController');

router.get('/', getEvents);
router.get('/:id', getEventById);
router.get('/:id/seats', getSeatsByEventId);

module.exports = router;
