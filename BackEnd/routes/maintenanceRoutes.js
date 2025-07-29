const express = require('express');
const router = express.Router();
const { getServiceTypes, addServiceInfo, getVehicleDocuments, getDriverDetails, getUpcomingTripVehicles } = require('../controllers/maintenanceController');
const authMiddleware = require('../middleware/authMiddleware');

// GET all service types
router.get('/service-types', getServiceTypes);

// POST new service info
router.post('/service-info', addServiceInfo);

// GET vehicle documents by vehicleId
router.get('/vehicle-documents/:vehicleId', getVehicleDocuments);

// GET driver details (user ID extracted from JWT token)
router.get('/driver-details', authMiddleware, getDriverDetails);

// GET upcoming trip vehicles
router.get('/upcoming-vehicles', authMiddleware, getUpcomingTripVehicles);

module.exports = router;
