import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { Layout, Menu, Drawer, Button, Grid } from 'antd';
import {
  MenuOutlined,
  UserOutlined,
  CarOutlined,
  FileProtectOutlined,
  ToolOutlined,
  EnvironmentOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import 'antd/dist/reset.css';
import './App.css';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Maintenance from './pages/maintenance';
import VehicleDocs from './pages/vehicleDoc';
import Profile from './pages/Profile';

const { Header, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

// Placeholder pages
const PasswordReset = () => <div>Password Reset Page</div>;
const AssignedTrips = () => <div>Assigned Trips Page</div>;
const TripMap = () => <div>Trip Route Map Page</div>;

const menuItems = [
  { key: '/trips', icon: <CarOutlined />, label: <Link to="/trips">Assigned Trips</Link> },
  { key: '/maintenance', icon: <ToolOutlined />, label: <Link to="/maintenance">Maintenance</Link> },
  { key: '/profile', icon: <UserOutlined />, label: <Link to="/profile">Profile</Link> },
  { key: '/vehicle-docs', icon: <FileProtectOutlined />, label: <Link to="/vehicle-docs">Vehicle Docs</Link> },
  { key: '/trip-map', icon: <EnvironmentOutlined />, label: <Link to="/trip-map">Trip Map</Link> },
  { key: '/login', icon: <LoginOutlined />, label: <Link to="/login">Logout</Link> },
];

function AppLayout() {
  const location = useLocation();
  const selectedKey = menuItems.find(item => location.pathname.startsWith(item.key))?.key || '/trips';
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', padding: 0, display: 'flex', alignItems: 'center' }}>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginLeft: 56 }}>Driver</div>
        <NavBar selectedKey={selectedKey} />
      </Header>
      <Content style={{ margin: 0, padding: 0, minHeight: 'calc(100vh - 120px)', background: '#fff', width: '100vw', maxWidth: '100vw', overflowX: 'hidden' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/trips" element={<AssignedTrips />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/vehicle-docs" element={<VehicleDocs />} />
          <Route path="/trip-map" element={<TripMap />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Content>
      <Footer style={{ textAlign: 'center', background: '#fff' }}>
        SunTrack Driver ©2024
      </Footer>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
