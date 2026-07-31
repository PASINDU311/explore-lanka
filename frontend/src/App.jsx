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

// User Session / LocalStorage Read Helper
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

// 🔒 Protected Route for Tourist Only
const ProtectedTouristRoute = ({ children }) => {
  const user = getUser();
  if (!user || user.role !== 'tourist') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// 🔒 Protected Route for Driver Only
const ProtectedDriverRoute = ({ children }) => {
  const user = getUser();
  if (!user || user.role !== 'driver') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// 🔒 Protected Route for Admin Only
const ProtectedAdminRoute = ({ children }) => {
  const user = getUser();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        
        {/* Explore / Places / Destinations Routes */}
        <Route path="/explore" element={<Explore />} />
        <Route path="/places" element={<Explore />} />
        <Route path="/destinations" element={<Explore />} />
        
        {/* AI Itinerary / Planner Routes */}
        <Route path="/planner" element={<Planner />} />
        <Route path="/itinerary" element={<Planner />} />
        <Route path="/ai-itinerary" element={<Planner />} />
        
        {/* 🔒 Tourist Protected Routes */}
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

        {/* 🔒 Driver Protected Routes */}
        <Route 
          path="/driver-dashboard" 
          element={
            <ProtectedDriverRoute>
              <DriverDashboard />
            </ProtectedDriverRoute>
          } 
        />

        {/* 🔒 Admin Protected Routes (All Admin Sub-paths point to AdminDashboard) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } 
        />
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } 
        />
        <Route 
          path="/admin/manage-users" 
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } 
        />
        <Route 
          path="/admin/manage-drivers" 
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } 
        />

        {/* Auth & Other Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Catch-all Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;