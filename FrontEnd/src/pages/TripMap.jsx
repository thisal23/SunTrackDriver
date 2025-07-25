import NavBar from "../components/NavBar";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function parseCoords(search) {
  const params = new URLSearchParams(search);
  const startLat = parseFloat(params.get("startLat"));
  const startLng = parseFloat(params.get("startLng"));
  const endLat = parseFloat(params.get("endLat"));
  const endLng = parseFloat(params.get("endLng"));
  if (
    isNaN(startLat) || isNaN(startLng) ||
    isNaN(endLat) || isNaN(endLng)
  ) {
    return null;
  }
  return {
    start: { lat: startLat, lng: startLng },
    end: { lat: endLat, lng: endLng },
  };
}

// Function to get route from Mapbox Directions API
async function getRoute(start, end) {
  const MAPBOX_ACCESS_TOKEN = `pk.eyJ1IjoiZWRkeWhhc3MiLCJhIjoiY21kZ2ZrOHZsMGtwcTJsc2VrN3FvbHM4aiJ9.S_9w6oaeS9o8H8flBZnVLA`; 
  
  try {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&overview=full&annotations=distance&access_token=${MAPBOX_ACCESS_TOKEN}`


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

const MapComponent = ({ start, end }) => {
  const [routeCoordinates, setRouteCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const center = {
    lat: (start.lat) ,
    lng: (start.lng),
  };

  useEffect(() => {
    const fetchRoute = async () => {
      setLoading(true);
      const route = await getRoute(start, end);
      setRouteCoordinates(route);
      setLoading(false);
    };
    
    fetchRoute();
  }, [start, end]);

  return (
    <div>
      {loading && <div style={{ padding: '10px', color: '#666' }}>Loading route...</div>}
      <MapContainer center={center} zoom={10} style={{ height: "600px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <Marker position={[start.lat, start.lng]} />
        <Marker position={[end.lat, end.lng]} />
        
        {routeCoordinates ? (
          <Polyline positions={routeCoordinates} color="blue" weight={4} />
        ) : (
          // Fallback to straight line if route fetch fails
          <Polyline positions={[[start.lat, start.lng], [end.lat, end.lng]]} color="red" weight={2} dashArray="5, 5" />
        )}
      </MapContainer>
    </div>
  );
};

function TripMap() {
  const location = useLocation();
  const coords = parseCoords(location.search);

  // Default values if not provided
  const defaultStart = { lat: 6.9271, lng: 79.8612 };
  const defaultEnd = { lat: 7.2906, lng: 80.6337 };

  let start, end;
  if (coords) {
    start = coords.start;
    end = coords.end;
  } else {
    start = defaultStart;
    end = defaultEnd;
  }

  return (
    <div>
      <NavBar />
      <h2 className="py-10">Trip Route</h2>
      {coords === null && (
        <div style={{ color: "#b00" }}>
          (Invalid or missing coordinates in URL. Showing default route.)
        </div>
      )}
      <MapComponent start={start} end={end} />
    </div>
  );
}

export default TripMap;