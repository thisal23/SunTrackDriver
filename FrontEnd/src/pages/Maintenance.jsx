import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Spin, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const Maintenance = () => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchServiceTypes = async () => {
//       try {
//         const res = await axios.get('/api/maintenance/service-types');
//         setServiceTypes(res.data);
//       } catch (err) {
//         message.error('Failed to load service types');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchServiceTypes();
//   }, []);

  const onFinish = (values) => {
    console.log('Form values:', values);
    // Here you would typically send the data to the backend
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #f0f1f2' }}>
      <h2>Vehicle Maintenance Entry</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Vehicle ID" name="vehicleId" rules={[{ required: true, message: 'Please enter vehicle ID' }]}> 
          <Input placeholder="Enter Vehicle ID" />
        </Form.Item>
        <Form.Item label="Service Type" name="serviceId" rules={[{ required: true, message: 'Please select service type' }]}> 
          {loading ? (
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
    </div>
  );
};

export default Maintenance;