import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axiosConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/assign-trips');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <span className="login-lock">🔒</span>
          <h2>Driver Login</h2>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <div className="login-field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your email" />
          </div>
          <div className="login-field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter your password" />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn">Login</button>
        </form>
        <div className="login-links">
          <button onClick={() => navigate('/forgot-password')} className="login-link">Forgot Password?</button>
          <span> | </span>
          <button onClick={() => navigate('/register')} className="login-link">Create Account</button>
        </div>
      </div>
    </div>
  );
};

export default Login; 