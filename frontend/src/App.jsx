import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Explore / Places Routes */}
        <Route path="/explore" element={<Explore />} />
        <Route path="/places" element={<Explore />} />
        
        {/* 🟢 AI Itinerary / Planner Routes දෙකම Planner Page එකට යොමු කර ඇත */}
        <Route path="/planner" element={<Planner />} />
        <Route path="/itinerary" element={<Planner />} />
        
        {/* Other Routes */}
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </Router>
  );
}

export default App;