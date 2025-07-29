const express = require('express');
const router = express.Router();
const { getDriverTrips, updateTripStatus } = require('../controllers/viewvehicle');
const { getClosestTrip, getUpcomingTrips } = require('../controllers/mapController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/driver-trips', authMiddleware, getDriverTrips);
router.patch('/:tripId/status', authMiddleware, updateTripStatus);

// GET /api/map/closest-trip
router.get('/map/closest-trip', authMiddleware, getClosestTrip);
router.get('/upcoming', authMiddleware, getUpcomingTrips);

module.exports = router;
