import React, { useEffect, useState } from 'react';
import { Card, Spin, Alert, message, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import apiService from '../config/axiosConfig';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const fetchDriver = async () => {
    try {
      // Check if user is authenticated
      if (!isAuthenticated) {
        setError('Please log in to view your profile');
        setLoading(false);
        return;
      }

      // The backend will extract the user ID from the JWT token
      const res = await apiService.get('maintenance/driver-details');
      console.log('Driver details response:', res.data); // Debug log
      setDriver(res.data);
    } catch (err) {
      console.error('Error fetching driver details:', err); // Debug log
      
      if (err.response?.status === 401) {
        // Unauthorized - token is invalid or expired
        localStorage.removeItem('token');
        setError('Your session has expired. Please log in again.');
      } else if (err.response?.status === 404) {
        setError('Driver details not found. Please contact support.');
      } else if (err.response?.status === 500) {
        setError('Server error occurred. Please check if you are logged in and try again.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Unable to connect to server. Please check your internet connection.');
      } else {
        setError('Failed to load driver details. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriver();
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchDriver();
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
      <h2 style={{ fontSize: '28px', marginBottom: '30px' }}>Driver Profile</h2>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <p style={{ marginTop: '16px' }}>Loading your profile...</p>
        </div>
      ) : error ? (
        <Card>
          <Alert
            type="error"
            message="Error"
            description={error}
            showIcon
            style={{ marginBottom: '16px' }}
          />
          <div style={{ textAlign: 'center' }}>
            {error.includes('log in') || error.includes('session') ? (
              <Button type="primary" onClick={handleLogin}>
                Go to Login
              </Button>
            ) : (
              <Button type="primary" onClick={handleRetry}>
                Retry
              </Button>
            )}
          </div>
        </Card>
      ) : !driver ? (
        <Alert type="warning" message="No driver details found" />
      ) : (
        <Card style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '16px', lineHeight: '2' }}>
            <p><b>NIC No:</b> {driver.nicNo}</p>
            <p><b>License No:</b> {driver.licenseNo}</p>
            <p><b>License Type:</b> {driver.licenseType}</p>
            <p><b>Contact No:</b> {driver.contactNo}</p>
            <p><b>Blood Group:</b> {driver.bloodGroup}</p>
            <p><b>Address:</b> {driver.address}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Profile;