import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axiosConfig';

const Register = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    nicNo: '',
    licenseNo: '',
    licenseType: '',
    contactNo: '',
    bloodGroup: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('/auth/register', form);
      setSuccess('Registration successful! You can now log in.');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <span className="login-lock">📝</span>
          <h2>Driver Registration</h2>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required className="login-field" />
          <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required className="login-field" />
          <input name="userName" placeholder="Username" value={form.userName} onChange={handleChange} required className="login-field" />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="login-field" />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="login-field" />
          <input name="nicNo" placeholder="NIC Number" value={form.nicNo} onChange={handleChange} required className="login-field" />
          <input name="licenseNo" placeholder="License Number" value={form.licenseNo} onChange={handleChange} required className="login-field" />
          <select name="licenseType" value={form.licenseType} onChange={handleChange} required className="login-field">
            <option value="">Select License Type</option>
            <option value="H">Heavy</option>
            <option value="L">Light</option>
            <option value="A">All</option>
          </select>
          <input name="contactNo" placeholder="Contact Number" value={form.contactNo} onChange={handleChange} required className="login-field" />
          <input name="bloodGroup" placeholder="Blood Group" value={form.bloodGroup} onChange={handleChange} required className="login-field" />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required className="login-field" />
          {error && <div className="login-error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <button type="submit" className="login-btn">Register</button>
        </form>
        <div className="login-links">
          <button onClick={() => navigate('/')} className="login-link">Back to Login</button>
        </div>
      </div>
    </div>
  );
};

export default Register; 