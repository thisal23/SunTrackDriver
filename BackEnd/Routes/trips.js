const express = require('express');
const router = express.Router();
const { getDriverTrips, updateTripStatus } = require('../controllers/viewvehicle');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/driver-trips',authMiddleware,getDriverTrips);
router.patch('/:tripId/status', authMiddleware, updateTripStatus);


module.exports = router;
