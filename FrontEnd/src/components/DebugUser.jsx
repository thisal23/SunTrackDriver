import React, { useState } from 'react';
import { Card, Button, Alert, Form, Input, Select } from 'antd';
import apiService from '../config/axiosConfig';

const { Option } = Select;

const DebugUser = () => {
  const [debugData, setDebugData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form] = Form.useForm();

  const checkUserDetails = async () => {
    setLoading(true);
    try {
      const response = await apiService.get('maintenance/debug-user');
      setDebugData(response.data);
      console.log('Debug data:', response.data);
    } catch (err) {
      console.error('Debug error:', err);
      setDebugData({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const addDriverDetails = async (values) => {
    setLoading(true);
    try {
      // First get the current user ID
      const debugResponse = await apiService.get('maintenance/debug-user');
      const userId = debugResponse.data.userId;
      
      // Add driver details
      const response = await apiService.post('maintenance/add-driver-details', {
        ...values,
        userId
      });
      
      alert('Driver details added successfully!');
      setShowForm(false);
      form.resetFields();
      checkUserDetails(); // Refresh the debug data
    } catch (err) {
      alert('Failed to add driver details: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Debug User Details" style={{ marginBottom: '20px' }}>
      <Button onClick={checkUserDetails} loading={loading} style={{ marginBottom: '16px' }}>
        Check User Details
      </Button>
      
      {debugData && (
        <div style={{ marginBottom: '16px' }}>
          <h4>Debug Information:</h4>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
            {JSON.stringify(debugData, null, 2)}
          </pre>
          
          {debugData.user && !debugData.driverDetail && (
            <Alert
              message="No driver details found"
              description="This user doesn't have driver details. You can add them below."
              type="warning"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          )}
        </div>
      )}
      
      {debugData?.user && !debugData?.driverDetail && (
        <Button 
          type="primary" 
          onClick={() => setShowForm(!showForm)}
          style={{ marginBottom: '16px' }}
        >
          {showForm ? 'Cancel' : 'Add Driver Details'}
        </Button>
      )}
      
      {showForm && (
        <Form form={form} onFinish={addDriverDetails} layout="vertical">
          <Form.Item name="nicNo" label="NIC No" rules={[{ required: true }]}>
            <Input placeholder="Enter NIC number" />
          </Form.Item>
          
          <Form.Item name="licenseNo" label="License No" rules={[{ required: true }]}>
            <Input placeholder="Enter license number" />
          </Form.Item>
          
          <Form.Item name="licenseType" label="License Type" rules={[{ required: true }]}>
            <Select placeholder="Select license type">
              <Option value="H">Heavy (H)</Option>
              <Option value="L">Light (L)</Option>
              <Option value="A">All (A)</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="contactNo" label="Contact No" rules={[{ required: true }]}>
            <Input placeholder="Enter contact number" />
          </Form.Item>
          
          <Form.Item name="bloodGroup" label="Blood Group" rules={[{ required: true }]}>
            <Select placeholder="Select blood group">
              <Option value="A+">A+</Option>
              <Option value="A-">A-</Option>
              <Option value="B+">B+</Option>
              <Option value="B-">B-</Option>
              <Option value="AB+">AB+</Option>
              <Option value="AB-">AB-</Option>
              <Option value="O+">O+</Option>
              <Option value="O-">O-</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="address" label="Address" rules={[{ required: true }]}>
            <Input.TextArea placeholder="Enter address" rows={3} />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Add Driver Details
            </Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default DebugUser; 