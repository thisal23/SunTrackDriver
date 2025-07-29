import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'antd';
import apiService from '../config/axiosConfig';

const ServerStatus = () => {
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState(null);

  const checkServer = async () => {
    setStatus('checking');
    setError(null);
    
    try {
      const response = await apiService.get('health');
      if (response.data.status === 'OK') {
        setStatus('connected');
      } else {
        setStatus('error');
        setError('Server responded but with unexpected status');
      }
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Failed to connect to server');
    }
  };

  useEffect(() => {
    checkServer();
  }, []);

  if (status === 'checking') {
    return <Alert message="Checking server connection..." type="info" showIcon />;
  }

  if (status === 'error') {
    return (
      <Alert
        message="Server Connection Error"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={checkServer}>
            Retry
          </Button>
        }
      />
    );
  }

  return <Alert message="Server connected successfully" type="success" showIcon />;
};

export default ServerStatus; 