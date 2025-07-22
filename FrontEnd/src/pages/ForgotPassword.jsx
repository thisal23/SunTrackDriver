import React, { useState } from 'react';
import axios from '../config/axiosConfig';
import { useNavigate } from 'react-router-dom';

const steps = [
  { label: 'Email', icon: '📧' },
  { label: 'Verify', icon: '🛡️' },
  { label: 'Reset', icon: '🔒' },
];

const ForgotPassword = () => {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      await axios.post('/auth/forgot-password', { email });
      setStep(1);
      setMessage('OTP sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    setOtpVerified(true);
    setStep(2);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await axios.post('/auth/reset-password', { email, otp, newPassword });
      setMessage('Password reset successful!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <form onSubmit={handleSendOtp} className="login-form">
            <div className="login-field">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your email" />
            </div>
            <button type="submit" className="login-btn">Send OTP</button>
          </form>
        );
      case 1:
        return (
          <form onSubmit={handleVerifyOtp} className="login-form">
            <div className="login-field">
              <label>OTP</label>
              <input type="text" value={otp} onChange={e => setOtp(e.target.value)} required placeholder="Enter OTP" />
            </div>
            <button type="submit" className="login-btn">Verify OTP</button>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleResetPassword} className="login-form">
            <div className="login-field">
              <label>New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="Enter new password" />
            </div>
            <div className="login-field">
              <label>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="Confirm new password" />
            </div>
            <button type="submit" className="login-btn">Reset Password</button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="reset-lock-icon" style={{ textAlign: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 48 }}>🔒</span>
        </div>
        <h3 style={{ textAlign: 'center' }}>Create a new secure password</h3>
        <div className="stepper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '24px 0' }}>
          {steps.map((s, idx) => (
            <React.Fragment key={s.label}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: idx === step ? '#2563eb' : '#e0e7ef',
                  color: idx === step ? '#fff' : '#2563eb',
                  borderRadius: '50%',
                  width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: 24, boxShadow: idx === step ? '0 2px 8px #2563eb33' : 'none'
                }}>{s.icon}</div>
                <div style={{ color: idx === step ? '#2563eb' : '#666', fontWeight: idx === step ? 600 : 400 }}>{s.label}</div>
              </div>
              {idx < steps.length - 1 && <div style={{ width: 40, height: 2, background: idx < step ? '#2563eb' : '#e0e7ef', margin: '0 8px', alignSelf: 'center' }} />}
            </React.Fragment>
          ))}
        </div>
        {renderStep()}
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {step > 0 && <button className="login-btn" style={{ background: '#2563eb', color: '#fff' }} onClick={() => setStep(step - 1)}>← Back</button>}
        </div>
        {message && <div className="success" style={{ marginTop: 16, background: '#e6fff2', color: '#059669', padding: 8, borderRadius: 4 }}>{message}</div>}
        {otpVerified && <div className="success" style={{ marginTop: 16, background: '#e6fff2', color: '#059669', padding: 8, borderRadius: 4 }}>OTP verified successfully</div>}
        {error && <div className="login-error" style={{ marginTop: 16 }}>{error}</div>}
      </div>
    </div>
  );
};

export default ForgotPassword; 