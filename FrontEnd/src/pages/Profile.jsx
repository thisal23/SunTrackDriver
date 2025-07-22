import React, { useEffect, useState } from 'react';
import { Card, Spin, Alert, message } from 'antd';
import axios from 'axios';

const Profile = ({ userId = 1 }) => { // Default userId for demo
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const res = await axios.get(`/api/maintenance/driver-details/${userId}`);
        setDriver(res.data);
      } catch (err) {
        message.error('Failed to load driver details');
      } finally {
        setLoading(false);
      }
    };
    fetchDriver();
  }, [userId]);

  return (
    <div style={{ maxWidth: 500, margin: '40px auto' }}>
      <h2>Driver Profile</h2>
      {loading ? (
        <Spin />
      ) : !driver ? (
        <Alert type="error" message="No driver details found" />
      ) : (
        <Card>
          <p><b>NIC No:</b> {driver.nicNo}</p>
          <p><b>License No:</b> {driver.licenseNo}</p>
          <p><b>License Type:</b> {driver.licenseType}</p>
          <p><b>Contact No:</b> {driver.contactNo}</p>
          <p><b>Blood Group:</b> {driver.bloodGroup}</p>
          <p><b>Address:</b> {driver.address}</p>
        </Card>
      )}
    </div>
  );
};

export default Profile;