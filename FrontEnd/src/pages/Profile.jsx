import React, { useEffect, useState } from 'react';
import { Card, Spin, Alert, message } from 'antd';
import apiService from '../config/axiosConfig';

const Profile = () => {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        // The backend will extract the user ID from the JWT token
        const res = await apiService.get('maintenance/driver-details');
        console.log('Driver details response:', res.data); // Debug log
        setDriver(res.data);
      } catch (err) {
        message.error('Failed to load driver details');
        console.error('Error fetching driver details:', err); // Debug log
      } finally {
        setLoading(false);
      }
    };
    fetchDriver();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
      <h2 style={{ fontSize: '28px', marginBottom: '30px' }}>Driver Profile</h2>
      {loading ? (
        <Spin size="large" />
      ) : !driver ? (
        <Alert type="error" message="No driver details found" />
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