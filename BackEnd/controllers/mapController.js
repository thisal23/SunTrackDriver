const { Op } = require('sequelize');
const axios = require('axios');
const { sequelize, Trip, TripDetail, DriverDetail, User } = require('../models');
const jwt = require('jsonwebtoken');

// Helper to geocode an address to lat/lng using Mapbox
async function geocodeAddress(address) {
    const mapboxToken = process.env.MAPBOX_TOKEN;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}&limit=1`;
    const res = await axios.get(url);
    if (res.data && res.data.features && res.data.features.length > 0) {
        const [lng, lat] = res.data.features[0].center;
        return { lat, lng };
    }
    return { lat: null, lng: null };
}

// GET /api/map/closest-trip
const getClosestTrip = async (req, res) => {
    try {
        const today = new Date();

        // Getting driver Id from token
        const decoded = jwt.verify(req.header('Authorization')?.replace('Bearer ', ''), process.env.JWT_SECRET);
        const userId = decoded.id;
        const driver = await DriverDetail.findOne({ where: { userId } });
        const driverId = driver.id;
        // Getting driver Id from token

        // Find the trip closest to today (future or past, whichever is closer)
        const trip = await Trip.findOne({
            order: [
                [
                    // Absolute difference between trip date and today
                    sequelize.literal(`ABS(DATEDIFF(date, '${today.toISOString().slice(0, 10)}'))`),
                    'ASC'
                ]
            ]
        });
        if (!trip) return res.status(404).json({ error: 'No trips found' });

        // Geocode start and end locations using Mapbox
        const startGeo = await geocodeAddress(trip.startLocation);
        const endGeo = await geocodeAddress(trip.endLocation);

        res.json({
            ...trip.toJSON(),
            startLat: startGeo.lat,
            startLng: startGeo.lng,
            endLat: endGeo.lat,
            endLng: endGeo.lng
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch closest trip', details: err.message });
    }
};

// GET /api/driver-trips/upcoming
const getUpcomingTrips = async (req, res) => {
    try {
        // User ID is already extracted by authMiddleware and available in req.user
        const userId = req.user.id;
        console.log('=== DEBUG: Fetching upcoming trips ===');
        console.log('User ID:', userId);
        console.log('Request headers:', req.headers);

        if (!userId) {
            console.log('ERROR: No user ID found');
            return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
        }

        const today = new Date();
        console.log('Today\'s date:', today.toISOString().slice(0, 10));

        // Find trips for this specific driver using Sequelize models
        console.log('Executing database query...');
        const trips = await Trip.findAll({
            attributes: [
                'id',
                'startLocation',
                'endLocation',
                'date',
                'suggestStartTime',
                'suggestEndTime',
                'status'
            ],
            include: [
                {
                    model: TripDetail,
                    as: 'tripDetail',
                    required: true, // This ensures only trips with trip details are returned
                    include: [
                        {
                            model: DriverDetail,
                            as: 'driver',
                            required: true, // This ensures only trips assigned to drivers are returned
                            include: [
                                {
                                    model: User,
                                    as: 'driverUser',
                                    where: { id: userId }, // Filter by the authenticated user
                                    required: true, // This ensures only trips for this specific user are returned
                                    attributes: [] // We don't need to select User columns
                                }
                            ],
                            attributes: [] // No need to select DriverDetail columns
                        }
                    ],
                    attributes: [] // No need to select TripDetail columns
                }
            ],
            where: {
                // Show trips from today onwards OR trips with status 'Assigned', 'In Progress', 'Pending'
                [Op.or]: [
                    {
                        date: {
                            [Op.gte]: today.toISOString().slice(0, 10)
                        }
                    },
                    {
                        status: {
                            [Op.in]: ['Assigned', 'In Progress', 'Pending']
                        }
                    }
                ]
            },
            order: [
                ['date', 'ASC'],
                ['suggestStartTime', 'ASC']
            ]
        });

        console.log(`Found ${trips.length} trips for user ${userId}`);
        console.log('Trips data:', JSON.stringify(trips, null, 2));

        if (trips.length === 0) {
            console.log('No trips found, returning empty array');
            return res.json([]);
        }

        // Geocode each trip's start and end locations
        console.log('Geocoding trip locations...');
        const tripsWithCoordinates = await Promise.all(
            trips.map(async (trip) => {
                const startGeo = await geocodeAddress(trip.startLocation);
                const endGeo = await geocodeAddress(trip.endLocation);

                return {
                    ...trip.toJSON(),
                    startLat: startGeo.lat,
                    startLng: startGeo.lng,
                    endLat: endGeo.lat,
                    endLng: endGeo.lng
                };
            })
        );

        console.log('Final response with coordinates:', JSON.stringify(tripsWithCoordinates, null, 2));
        res.json(tripsWithCoordinates);
    } catch (err) {
        console.error('ERROR in getUpcomingTrips:', err);
        console.error('Error stack:', err.stack);
        res.status(500).json({ error: 'Failed to fetch upcoming trips', details: err.message });
    }
};

module.exports = { getClosestTrip, getUpcomingTrips };
