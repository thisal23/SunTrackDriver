import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import { Select, Spin, Alert, message } from "antd";
import "leaflet/dist/leaflet.css";
import apiService from '../config/axiosConfig';

const { Option } = Select;

// Sri Lanka bounds
const SRI_LANKA_BOUNDS = [
  [5.916667, 79.516667], // Southwest corner
  [9.850000, 81.883333]  // Northeast corner
];

// Sri Lanka center coordinates
const SRI_LANKA_CENTER = [7.8731, 80.7718];

function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    // Check if coordinates are within Sri Lanka bounds
    if (lat >= SRI_LANKA_BOUNDS[0][0] && lat <= SRI_LANKA_BOUNDS[1][0] &&
        lng >= SRI_LANKA_BOUNDS[0][1] && lng <= SRI_LANKA_BOUNDS[1][1]) {
      map.setView([lat, lng], map.getZoom());
    } else {
      // If outside Sri Lanka, center on Sri Lanka
      map.setView(SRI_LANKA_CENTER, 7);
    }
  }, [lat, lng, map]);
  return null;
}

// Function to get route from Mapbox Directions API (restricted to Sri Lanka)
async function getRoute(start, end) {
  const MAPBOX_ACCESS_TOKEN = `pk.eyJ1IjoiZWRkeWhhc3MiLCJhIjoiY21kZ2ZrOHZsMGtwcTJsc2VrN3FvbHM4aiJ9.S_9w6oaeS9o8H8flBZnVLA`; 
  try {
    // Add Sri Lanka bounds to the request
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&overview=full&annotations=distance&access_token=${MAPBOX_ACCESS_TOKEN}&bbox=${SRI_LANKA_BOUNDS[0][1]},${SRI_LANKA_BOUNDS[0][0]},${SRI_LANKA_BOUNDS[1][1]},${SRI_LANKA_BOUNDS[1][0]}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch route');
    }
    const data = await response.json();
    const coordinates = data.routes[0].geometry.coordinates;
    // Convert from [lng, lat] to [lat, lng] format for Leaflet
    return coordinates.map(coord => [coord[1], coord[0]]);
  } catch (error) {
    console.error('Error fetching route:', error);
    return null;
  }
}

// Function to check if coordinates are within Sri Lanka
function isWithinSriLanka(lat, lng) {
  return lat >= SRI_LANKA_BOUNDS[0][0] && lat <= SRI_LANKA_BOUNDS[1][0] &&
         lng >= SRI_LANKA_BOUNDS[0][1] && lng <= SRI_LANKA_BOUNDS[1][1];
}

const MapComponent = ({ start, end }) => {
  const [routeCoordinates, setRouteCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoute = async () => {
      setLoading(true);
      setError(null);
      
      // Check if both start and end points are within Sri Lanka
      if (!isWithinSriLanka(start.lat, start.lng) || !isWithinSriLanka(end.lat, end.lng)) {
        setError('Route is outside Sri Lanka boundaries');
        setLoading(false);
        return;
      }

      const route = await getRoute(start, end);
      setRouteCoordinates(route);
      setLoading(false);
    };
    fetchRoute();
  }, [start, end]);

  return (
    <div>
      {loading && <div style={{ padding: '10px', color: '#666' }}>Loading route...</div>}
      {error && <div style={{ padding: '10px', color: '#ff4d4f' }}>{error}</div>}
      
      <MapContainer 
        center={SRI_LANKA_CENTER} 
        zoom={12} 
        style={{ height: "400px", width: "100%" }}
        maxBounds={SRI_LANKA_BOUNDS}
        maxBoundsViscosity={1.0}
        minZoom={6}
        maxZoom={15}
      >
        <RecenterMap lat={start.lat} lng={start.lng} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {/* Only show markers if they're within Sri Lanka */}
        {isWithinSriLanka(start.lat, start.lng) && (
          <Marker position={[start.lat, start.lng]} />
        )}
        {isWithinSriLanka(end.lat, end.lng) && (
          <Marker position={[end.lat, end.lng]} />
        )}
        
        {routeCoordinates && !error ? (
          <Polyline positions={routeCoordinates} color="blue" weight={4} />
        ) : (
          isWithinSriLanka(start.lat, start.lng) && isWithinSriLanka(end.lat, end.lng) && (
            <Polyline positions={[[start.lat, start.lng], [end.lat, end.lng]]} color="red" weight={2} dashArray="5, 5" />
          )
        )}
      </MapContainer>
    </div>
  );
};

function TripMap() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        console.log('=== FRONTEND DEBUG: Fetching trips ===');
        console.log('Making API call to: driver-trips/upcoming');
        console.log('apiService:', apiService);
        
        // Check if we have a token
        const token = localStorage.getItem('token');
        console.log('Token exists:', !!token);
        
        // Add a try-catch around just the API call
        let res;
        try {
          console.log('About to make API call...');
          res = await apiService.get('driver-trips/upcoming');
          console.log('API call completed successfully');
        } catch (apiError) {
          console.error('API call failed:', apiError);
          throw apiError;
        }
        
        console.log('API Response:', res);
        console.log('Response data:', res.data);
        console.log('Response status:', res.status);
        
        setTrips(res.data);
        if (res.data && res.data.length > 0) {
          console.log('Setting first trip as selected:', res.data[0]);
          setSelectedTrip(res.data[0]); // Select first trip by default
        } else {
          console.log('No trips found in response');
        }
      } catch (err) {
        console.error('=== FRONTEND ERROR ===');
        console.error('Error details:', err);
        console.error('Error response:', err.response);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        
        setError('Failed to fetch upcoming trips');
        message.error('Failed to load upcoming trips');
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const handleTripSelect = (tripId) => {
    const trip = trips.find(t => t.id === tripId);
    setSelectedTrip(trip);
  };

  const formatTripOption = (trip) => {
    const date = trip.date ? new Date(trip.date).toLocaleDateString() : 'No date';
    return `${date} - ${trip.startLocation} to ${trip.endLocation}`;
  };

  return (
    <div style={{ 
      padding: '20px',
      paddingTop: '130px',
      paddingRight: '30px', // Account for sticky header (64px) + extra space
      maxWidth: '1200px', 
      margin: '0 auto'
    }}>
      <h2 style={{ fontSize: '28px', marginBottom: '30px', textAlign: 'center' }}>Trip Route Map</h2>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p style={{ marginTop: '20px' }}>Loading upcoming trips...</p>
        </div>
      ) : error ? (
        <Alert type="error" message={error} style={{ marginBottom: '20px' }} />
      ) : trips.length === 0 ? (
        <Alert 
          type="info" 
          message="No upcoming trips found" 
          description="You don't have any upcoming trips assigned at the moment."
          style={{ marginBottom: '20px' }}
        />
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '16px', fontWeight: 'bold' }}>
              Select Trip to View:
            </label>
            <Select
              style={{ width: '100%', maxWidth: '600px' }}
              placeholder="Choose a trip to view on the map"
              value={selectedTrip?.id}
              onChange={handleTripSelect}
              size="large"
            >
              {trips.map((trip) => (
                <Option key={trip.id} value={trip.id}>
                  {formatTripOption(trip)}
                </Option>
              ))}
            </Select>
          </div>

          {selectedTrip && (
            <>
              <div style={{ 
                marginBottom: '24px', 
                background: '#f6ffed', 
                border: '1px solid #b7eb8f', 
                borderRadius: '8px', 
                padding: '10px',
                fontSize: '16px'
              }}>
                <h3 style={{ marginBottom: '15px', color: '#389e0d' }}>Selected Trip Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'}}>
                  <p><strong>Date:</strong> {selectedTrip.date ? new Date(selectedTrip.date).toLocaleString() : 'Not specified'}</p>
                  <p><strong>Start Location:</strong> {selectedTrip.startLocation}</p>
                  <p><strong>End Location:</strong> {selectedTrip.endLocation}</p>
                  <p><strong>Status:</strong> <span style={{ 
                    color: selectedTrip.status === 'Assigned' ? '#1890ff' : 
                           selectedTrip.status === 'In Progress' ? '#faad14' : 
                           selectedTrip.status === 'Completed' ? '#52c41a' : '#666'
                  }}>{selectedTrip.status}</span></p>
                </div>
              </div>

              {selectedTrip.startLat && selectedTrip.startLng && selectedTrip.endLat && selectedTrip.endLng ? (
                <MapComponent 
                  start={{ lat: selectedTrip.startLat, lng: selectedTrip.startLng }} 
                  end={{ lat: selectedTrip.endLat, lng: selectedTrip.endLng }} 
                />
              ) : (
                <Alert 
                  type="warning" 
                  message="Map Unavailable" 
                  description="Location coordinates are not available for this trip."
                  style={{ marginBottom: '20px' }}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default TripMap;