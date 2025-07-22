const { Service, ServiceInfo, VehicleDetail, DriverDetail } = require('../models');

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

// GET /api/maintenance/driver-details/:userId
const getDriverDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        const detail = await DriverDetail.findOne({ where: { userId } });
        if (!detail) return res.status(404).json({ error: 'Driver details not found' });
        res.json(detail);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch driver details', details: err.message });
    }
};

module.exports = {
    getServiceTypes,
    addServiceInfo,
    getVehicleDocuments,
    getDriverDetails
};
