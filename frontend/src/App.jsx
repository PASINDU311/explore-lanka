import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Planner from './pages/Planner';
import Drivers from './pages/Drivers';
import Dashboard from './pages/Dashboard';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';

// 🔒 Protected Route for Tourist Only
const ProtectedTouristRoute = ({ children }) => {
  const getUser = () => {
    try {
      const sessionUser = sessionStorage.getItem('user');
      if (sessionUser) return JSON.parse(sessionUser);

      const localUser = localStorage.getItem('user');
      if (localUser) return JSON.parse(localUser);
    } catch (e) {
      console.error('Error reading user:', e);
    }
    return null;
  };

  const user = getUser();

  // Tourist කෙනෙක් නෙමෙයි නම් Login එකට Redirect කරයි
  if (!user || user.role !== 'tourist') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Explore / Places Routes */}
        <Route path="/explore" element={<Explore />} />
        <Route path="/places" element={<Explore />} />
        
        {/* AI Itinerary / Planner Routes */}
        <Route path="/planner" element={<Planner />} />
        <Route path="/itinerary" element={<Planner />} />
        
        {/* 🔒 Tourist ට විතරක් Access කරන්න පුළුවන් ආරක්ෂිත Routes */}
        <Route 
          path="/drivers" 
          element={
            <ProtectedTouristRoute>
              <Drivers />
            </ProtectedTouristRoute>
          } 
        />
        <Route 
          path="/my-bookings" 
          element={
            <ProtectedTouristRoute>
              <MyBookings />
            </ProtectedTouristRoute>
          } 
        />

        {/* Other Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;