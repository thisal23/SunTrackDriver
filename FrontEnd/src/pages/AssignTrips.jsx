import React, { useEffect, useState } from 'react';

const AssignTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/driver-trips/driver-trips', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch trips');
        }
        const data = await response.json();
        setTrips(data);
      } catch (err) {
        setError('Failed to fetch trips');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) return <div>Loading assigned trips...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="assign-trips-page">
      <h2>Assigned Trips</h2>
      {trips.length === 0 ? (
        <p>No trips assigned.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Trip ID</th>
              <th>Start Location</th>
              <th>End Location</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Vehicle</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {trips.map(trip => (
              <tr key={trip.trip_id}>
                <td>{trip.trip_id}</td>
                <td>{trip.startLocation}</td>
                <td>{trip.endLocation}</td>
                <td>{trip.trip_date}</td>
                <td>{trip.suggestStartTime}</td>
                <td>{trip.suggestEndTime}</td>
                <td>{trip.vehicle_plate} ({trip.vehicle_brand} {trip.vehicle_model})</td>
                <td>{trip.trip_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AssignTrips; 