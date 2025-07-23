const express = require('express');
const router = express.Router();
const { getDriverTrips } = require('../controllers/viewvehicle');
//const authMiddleware = require('../middleware/authMiddleware');

router.get('/driver-trips', getDriverTrips);

module.exports = router;
