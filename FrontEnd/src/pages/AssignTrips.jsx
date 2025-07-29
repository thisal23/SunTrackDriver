import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaClock, FaPlayCircle, FaFlag, FaCalendarDay, FaExclamationCircle } from "react-icons/fa";

import './AssignTrips.css';

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

  const statusMap = {
    planned: { color: '#6c63ff', icon: <FaClock />, label: 'Planned' },
    finished: { color: '#4caf50', icon: <FaFlag />, label: 'Finished' },
    live: { color: '#2196f3', icon: <FaPlayCircle />, label: 'Live' },
    pending: { color: '#ff9800', icon: <FaCalendarDay />, label: 'Pending' },
    ready: { color: '#00bcd4', icon: <FaCheckCircle />, label: 'Ready' },
    expired: { color: '#f44336', icon: <FaExclamationCircle />, label: 'Expired' },
    today: { color: '#1976d2', icon: <FaCalendarDay />, label: "Today's Trip" },
  };

  const getStatusType = (tripDate, suggestStartTime, status) => {
    const today = new Date();
    const trip = new Date(tripDate);
    today.setHours(0,0,0,0);
    trip.setHours(0,0,0,0);
    if (trip < today) return 'expired';
    if (trip.getTime() === today.getTime()) {
      // Check if suggestStartTime is before now
      const now = new Date();
      const [h, m, s] = suggestStartTime.split(':');
      const tripStart = new Date(tripDate);
      tripStart.setHours(Number(h), Number(m), Number(s || 0), 0);
      if (tripStart < now) return 'expired';
      return 'today';
    }
    return status;
  };

  const handleStatusChange = async (tripId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      // Update status optimistically
      setTrips(prev => prev.map(trip => trip.trip_id === tripId ? { ...trip, trip_status: newStatus } : trip));
      await fetch(`http://localhost:8000/api/driver-trips/${tripId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      setError('Failed to update trip status');
    }
  };

  const sortedTrips = [...trips].sort((a, b) => new Date(a.trip_date) - new Date(b.trip_date)); // ascending

  return (
    <div className="assign-trips-page">
      <h2>Assigned Trips</h2>
      {trips.length === 0 ? (
        <p>No trips assigned.</p>
      ) : (
        <div className="table-scroll-container">
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTrips.map(trip => {
                const statusType = getStatusType(trip.trip_date, trip.suggestStartTime, trip.trip_status);
                const statusInfo = statusMap[statusType] || {};
                return (
                  <tr key={trip.trip_id} className={`trip-row ${statusType}`}>
                    <td>{trip.trip_id}</td>
                    <td>{trip.startLocation}</td>
                    <td>{trip.endLocation}</td>
                    <td>{trip.trip_date}</td>
                    <td>{trip.suggestStartTime}</td>
                    <td>{trip.suggestEndTime}</td>
                    <td>{trip.vehicle_plate} ({trip.vehicle_brand} {trip.vehicle_model})</td>
                    <td style={{ color: statusInfo.color, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                      {statusInfo.icon} {statusInfo.label}
                    </td>
                    <td className="action-buttons">
                      <button
                        className="accept-btn"
                        disabled={statusType === 'live' || statusType === 'finished' || statusType === 'expired'}
                        onClick={() => handleStatusChange(trip.trip_id, 'live')}
                      >
                        <FaCheckCircle /> Accept
                      </button>
                      <button
                        className="reject-btn"
                        disabled={statusType === 'planned' || statusType === 'finished' || statusType === 'expired'}
                        onClick={() => handleStatusChange(trip.trip_id, 'planned')}
                      >
                        <FaTimesCircle /> Reject
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssignTrips; 