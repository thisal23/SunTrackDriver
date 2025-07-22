const express = require('express');
const router = express.Router();
const { getServiceTypes, addServiceInfo, getVehicleDocuments, getDriverDetails } = require('../controllers/maintenanceController');

// GET all service types
router.get('/service-types', getServiceTypes);

// POST new service info
router.post('/service-info', addServiceInfo);

// GET vehicle documents by vehicleId
router.get('/vehicle-documents/:vehicleId', getVehicleDocuments);

// GET driver details by userId
router.get('/driver-details/:userId', getDriverDetails);

module.exports = router;
