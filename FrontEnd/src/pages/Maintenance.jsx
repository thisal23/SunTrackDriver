import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Spin, message } from 'antd';
import axios from '../config/axiosConfig'; // Use configured axios for token

const { Option } = Select;

const Maintenance = () => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [form] = Form.useForm();
  const [lastServiceInfo, setLastServiceInfo] = useState(null);

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const res = await axios.get('maintenance/service-types');
        setServiceTypes(res.data);
      } catch (err) {
        message.error('Failed to load service types');
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServiceTypes();
  }, []);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get('maintenance/upcoming-vehicles');
        setVehicles(res.data);
      } catch (err) {
        message.error('Failed to load vehicles');
      } finally {
        setLoadingVehicles(false);
      }
    };
    fetchVehicles();
  }, []);

  const onFinish = async (values) => {
    try {
      const res = await axios.post('maintenance/service-info', values);
      message.success('Service info submitted successfully');
      form.resetFields();
      setLastServiceInfo(res.data);
    } catch (err) {
      message.error('Failed to submit service info');
    }
  };

  // Helper functions to display names instead of IDs
  const getVehiclePlate = (id) => {
    const v = vehicles.find(vehicle => vehicle.id === id);
    return v ? v.plateNo : id;
  };
  const getServiceType = (id) => {
    const s = serviceTypes.find(type => type.id === id);
    return s ? s.serviceType : id;
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #f0f1f2' }}>
      <h2>Vehicle Maintenance Entry</h2>
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item label="Vehicle" name="vehicleId" rules={[{ required: true, message: 'Please select a vehicle' }]}> 
          {loadingVehicles ? (
            <Spin />
          ) : (
            <Select placeholder="Select Vehicle">
              {vehicles.map(vehicle => (
                <Option key={vehicle.id} value={vehicle.id}>{vehicle.plateNo}</Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Service Type" name="serviceId" rules={[{ required: true, message: 'Please select service type' }]}> 
          {loadingServices ? (
            <Spin />
          ) : (
            <Select placeholder="Select Service Type">
              {serviceTypes.map(type => (
                <Option key={type.id} value={type.id}>{type.serviceType}</Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Service Remark" name="serviceRemark">
          <Input.TextArea placeholder="Enter any remarks" rows={3} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>Submit</Button>
        </Form.Item>
      </Form>
      {lastServiceInfo && (
        <div style={{ marginTop: 32, padding: 16, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 6 }}>
          <h3>Last Added Service Info</h3>
          <p><strong>Vehicle:</strong> {getVehiclePlate(lastServiceInfo.vehicleId)}</p>
          <p><strong>Service Type:</strong> {getServiceType(lastServiceInfo.serviceId)}</p>
          <p><strong>Remark:</strong> {lastServiceInfo.serviceRemark || '-'}</p>
        </div>
      )}
    </div>
  );
};

export default Maintenance;