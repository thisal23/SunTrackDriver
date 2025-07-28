const { Op } = require('sequelize');
const { Trip, TripDetail, Vehicle, Service, ServiceInfo, VehicleDetail, DriverDetail } = require('../models');
const jwt = require('jsonwebtoken');
// GET /api/maintenance/service-types
const getServiceTypes = async (req, res) => {
    try {
        const services = await Service.findAll({ attributes: ['id', 'serviceType'] });
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch service types', details: err.message });
    }
};

// POST /api/maintenance/service-info
const addServiceInfo = async (req, res) => {
    try {
        const { serviceId, vehicleId, userId, serviceRemark } = req.body;
        if (!serviceId || !vehicleId) {
            return res.status(400).json({ error: 'serviceId and vehicleId are required' });
        }
        const newServiceInfo = await ServiceInfo.create({
            serviceId,
            vehicleId,
            userId: userId || null,
            serviceRemark: serviceRemark || null,
        });
        res.status(201).json(newServiceInfo);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add service info', details: err.message });
    }
};

// GET /api/maintenance/vehicle-documents/:vehicleId
const getVehicleDocuments = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const doc = await VehicleDetail.findOne({ where: { vehicleId } });
        if (!doc) return res.status(404).json({ error: 'Vehicle documents not found' });
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch vehicle documents', details: err.message });
    }
};

// GET /api/maintenance/driver-details
const getDriverDetails = async (req, res) => {

    // Getting driver Id from token
    const decoded = jwt.verify(req.header('Authorization')?.replace('Bearer ', ''), process.env.JWT_SECRET);
    const userId = decoded.id;
    // Getting driver Id from token

    try {
        const detail = await DriverDetail.findOne({ where: { userId } });
        if (!detail) return res.status(404).json({ error: 'Driver details not found' });
        res.json(detail);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch driver details', details: err.message });
    }
};

// GET /api/maintenance/upcoming-vehicles
const getUpcomingTripVehicles = async (req, res) => {
    try {
        const now = new Date();

        // Getting driver Id from token
        const decoded = jwt.verify(req.header('Authorization')?.replace('Bearer ', ''), process.env.JWT_SECRET);
        const userId = decoded.id;
        const driver = await DriverDetail.findOne({ where: { userId } });
        const driverId = driver.id;
        // Getting driver Id from token

        // 1. Find all upcoming trips
        const upcomingTrips = await Trip.findAll({
            where: { date: { [Op.gt]: now } },
            attributes: ['id']
        });
        const tripIds = upcomingTrips.map(trip => trip.id);

        if (tripIds.length === 0) {
            return res.json();
        }

        // 2. Find all TripDetails for those trips
        const tripDetails = await TripDetail.findAll({
            where: { tripId: tripIds },
            where: { driverId: driverId },
            attributes: ['vehicleId']
        });
        const vehicleIds = [...new Set(tripDetails.map(td => td.vehicleId))];

        if (vehicleIds.length === 0) {
            return res.json();
        }

        // 3. Fetch vehicles
        const vehicles = await Vehicle.findAll({
            where: { plateNo: vehicleIds },
            attributes: ['id', 'plateNo']
        });

        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch upcoming trip vehicles', details: err.message });
    }
};

module.exports = {
    getServiceTypes,
    addServiceInfo,
    getVehicleDocuments,
    getDriverDetails,
    getUpcomingTripVehicles,
};
