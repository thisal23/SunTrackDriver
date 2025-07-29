import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Drawer, Button, Grid } from 'antd';
import {
  MenuOutlined,
  UserOutlined,
  CarOutlined,
  FileProtectOutlined,
  ToolOutlined,
  EnvironmentOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { useBreakpoint } = Grid;

const NavBar = ({ selectedKey }) => {
  const screens = useBreakpoint();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { key: '/trips', icon: <CarOutlined />, label: <Link to="/trips">Assigned Trips</Link> },
    { key: '/maintenance', icon: <ToolOutlined />, label: <Link to="/maintenance">Maintenance</Link> },
    { key: '/profile', icon: <UserOutlined />, label: <Link to="/profile">Profile</Link> },
    { key: '/vehicle-docs', icon: <FileProtectOutlined />, label: <Link to="/vehicle-docs">Vehicle Docs</Link> },
    { key: '/trip-map', icon: <EnvironmentOutlined />, label: <Link to="/trip-map">Trip Map</Link> },
    { key: '/logout', icon: <LoginOutlined />, label: <span onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</span> },
  ];

  // Mobile: show Drawer
  if (!screens.md) {
    return (
      <>
        <Button
          type="text"
          icon={<MenuOutlined style={{ fontSize: 24, color: '#fff' }} />}
          onClick={() => setDrawerOpen(open => !open)}
          style={{ position: 'absolute', left: 16, top: 16, zIndex: 1001 }}
        />
        <Drawer
          title={<span style={{ color: '#fff' }}>SunTrack Driver</span>}
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          styles={{ body: { padding: 0, background: '#001529' } ,header: { background: '#001529' } }}
          width="100vw"
          style={{ background: '#001529' }}
        >
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={() => setDrawerOpen(false)}
            style={{ border: 'none', fontWeight: 500, background: '#001529', color: '#fff' }}
          />
        </Drawer>
      </>
    );
  }
  // Desktop: show horizontal Menu
  return (
    <Menu
      mode="horizontal"
      theme="dark"
      selectedKeys={[selectedKey]}
      items={menuItems}
      style={{ minWidth: 0, flex: 1, justifyContent: 'center', border: 'none', background: '#001529', fontWeight: 500, color: '#fff' }}
    />
  );
};

export default NavBar; 