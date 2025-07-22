import React, { useEffect, useState } from 'react';
import { Card, Alert, Spin, message } from 'antd';
import axios from 'axios';

// Helper to check if a date is within 30 days from now
function isNearExpiry(dateStr) {
  if (!dateStr) return false;
  const now = new Date();
  const expiry = new Date(dateStr);
  const diff = (expiry - now) / (1000 * 60 * 60 * 24);
  return diff <= 30 && diff >= 0;
}

const VehicleDoc = ({ vehicleId = 1 }) => { // Default vehicleId for demo
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await axios.get(`/api/maintenance/vehicle-documents/${vehicleId}`);
        setDoc(res.data);
      } catch (err) {
        message.error('Failed to load vehicle documents');
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [vehicleId]);

  if (loading) return <Spin />;
  if (!doc) return <Alert type="error" message="No document data found" />;

  const notifications = [];
  if (isNearExpiry(doc.licenseExpireDate)) notifications.push('License is near expiry!');
  if (isNearExpiry(doc.insuranceExpireDate)) notifications.push('Insurance is near expiry!');
  if (isNearExpiry(doc.ecoExpireDate)) notifications.push('Eco Test is near expiry!');

  return (
    <div style={{ maxWidth: 500}}>
      <h2>Vehicle Document Details</h2>
      {notifications.length > 0 && (
        <Alert
          type="warning"
          message="Document Expiry Warning"
          description={notifications.map((n, i) => <div key={i}>{n}</div>)}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <Card title="License">
        <p>ID: {doc.licenseId}</p>
        <p>Last Update: {doc.licenseLastUpdate}</p>
        <p>Expire Date: {doc.licenseExpireDate}</p>
      </Card>
      <Card title="Insurance" style={{ marginTop: 16 }}>
        <p>No: {doc.insuranceNo}</p>
        <p>Type: {doc.insuranceType}</p>
        <p>Last Update: {doc.insuranceLastUpdate}</p>
        <p>Expire Date: {doc.insuranceExpireDate}</p>
      </Card>
      <Card title="Eco Test" style={{ marginTop: 16 }}>
        <p>ID: {doc.ecoId}</p>
        <p>Last Update: {doc.ecoLastUpdate}</p>
        <p>Expire Date: {doc.ecoExpireDate}</p>
      </Card>
    </div>
  );
};

export default VehicleDoc;