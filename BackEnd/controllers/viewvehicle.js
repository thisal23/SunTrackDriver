const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

const getDriverTrips = async (req, res) => {
  try {
    const userId = req.user?.id;
    console.log(userId);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
    }

    const trips = await sequelize.query(
      `SELECT 
    t.id AS trip_id,
    t.startLocation,
    t.endLocation,
    t.date AS trip_date,
    t.suggestStartTime,
    t.suggestEndTime,
    v.plateNo AS vehicle_plate,
    vb.brand AS vehicle_brand,
    vm.model AS vehicle_model,
    t.status AS trip_status
FROM 
    trips t
JOIN 
    tripdetails td ON t.id = td.tripId
JOIN 
    driverdetails dd ON td.driverId = dd.id
JOIN 
    users u ON dd.userId = u.id
LEFT JOIN 
    vehicles v ON td.vehicleId = v.plateNo
LEFT JOIN 
    vehiclebrands vb ON v.brandId = vb.id
LEFT JOIN 
    vehiclemodels vm ON v.modelId = vm.id
WHERE 
    u.id = :userId
    
ORDER BY 
    t.date DESC, t.suggestStartTime;`,
      {
        replacements: { userId },
        type: QueryTypes.SELECT
      }
    );

    res.json(trips);
  } catch (error) {
    console.error('Error fetching driver trips:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateTripStatus = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { status } = req.body;


    console.log(`Updating trip ${tripId} to status ${status}`);


    if (!tripId || !status) {
      return res.status(400).json({ message: 'Missing tripId or status' });
    }
    // Update the trip status
    const result = await sequelize.query(
      `UPDATE trips SET status = :status WHERE id = :tripId`,
      {
        replacements: { status, tripId },
        type: QueryTypes.UPDATE
      }
    );
    if (result === 0) {
      return res.status(404).json({ message: 'Trip not found or not updated' });
    }
    res.json({ message: 'Trip status updated successfully' });
  } catch (error) {
    console.error('Error updating trip status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getDriverTrips, updateTripStatus };
