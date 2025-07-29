import React, { useEffect, useState } from 'react';
import { Card, Alert, Spin, message, Select } from 'antd';
import axios from '../config/axiosConfig';
import NavBar from '../components/NavBar';

const { Option } = Select;

// Helper to check if a date is within 30 days from now
function isNearExpiry(dateStr) {
  if (!dateStr) return false;
  const now = new Date();
  const expiry = new Date(dateStr);
  const diff = (expiry - now) / (1000 * 60 * 60 * 24);
  return diff <= 30 && diff >= 0;
}

const VehicleDoc = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get('maintenance/upcoming-vehicles');
        setVehicles(res.data);
        if (res.data.length > 0) {
          setSelectedVehicleId(res.data[0].id);
        }
      } catch (err) {
        message.error('Failed to load vehicles');
      } finally {
        setLoadingVehicles(false);
      }
    };
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (!selectedVehicleId) return;
    const fetchDoc = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`maintenance/vehicle-documents/${selectedVehicleId}`);
        setDoc(res.data);
      } catch (err) {
        setDoc(null);
        message.error('Failed to load vehicle documents');
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [selectedVehicleId]);

  return (
    <div>
      <NavBar />
      <h2>Vehicle Document Details</h2>
      <div style={{ marginBottom: 16 }}>
        {loadingVehicles ? (
          <Spin />
        ) : (
          <Select
            style={{ width: 250 }}
            placeholder="Select Vehicle"
            value={selectedVehicleId}
            onChange={setSelectedVehicleId}
          >
            {vehicles.map(vehicle => (
              <Option key={vehicle.id} value={vehicle.id}>{vehicle.plateNo}</Option>
            ))}
          </Select>
        )}
      </div>
      {loading ? (
        <Spin />
      ) : !doc ? (
        <Alert type="error" message="No document data found" />
      ) : (
        <>
          {(() => {
            const notifications = [];
            if (isNearExpiry(doc.licenseExpireDate)) notifications.push('License is near expiry!');
            if (isNearExpiry(doc.insuranceExpireDate)) notifications.push('Insurance is near expiry!');
            if (isNearExpiry(doc.ecoExpireDate)) notifications.push('Eco Test is near expiry!');
            return notifications.length > 0 && (
              <Alert
                type="warning"
                message="Document Expiry Warning"
                description={notifications.map((n, i) => <div key={i}>{n}</div>)}
                showIcon
                style={{ marginBottom: 16 }}
              />
            );
          })()}
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
        </>
      )}
    </div>
  );
};

export default VehicleDoc;