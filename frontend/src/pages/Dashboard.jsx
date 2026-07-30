import React, { useState, useEffect } from 'react';
import API from '../services/api';
import TouristDashboard from './TouristDashboard';
import DriverDashboard from './DriverDashboard';

const Dashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/auth/profile');
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      } catch (err) {
        console.error('Error fetching profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', margin: '4rem' }}><h3>🔄 Loading Dashboard...</h3></div>;
  }

  // Role එක අනුව Dedicated UI එක පෙන්නීම
  if (user.role === 'driver') {
    return <DriverDashboard user={user} />;
  }

  return <TouristDashboard user={user} />;
};

export default Dashboard;