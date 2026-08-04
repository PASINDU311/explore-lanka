import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageCurrencyProvider } from './context/LanguageCurrencyContext'; // 👈 Import Provider
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Planner from './pages/Planner';
import Drivers from './pages/Drivers';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';

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
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'tourist') return <Navigate to="/" replace />;
  return children;
};

// 🔒 Protected Route for Driver Only
const ProtectedDriverRoute = ({ children }) => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'driver') return <Navigate to="/" replace />;
  return children;
};

// 🔒 Protected Route for Admin Only
const ProtectedAdminRoute = ({ children }) => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <LanguageCurrencyProvider> {/* 👈 Context Provider Wrapped */}
      <Router>
        <Navbar />
        <Routes>
          {/* 🌐 Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/destinations" element={<Explore />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/ai-itinerary" element={<Planner />} />
          <Route path="/drivers" element={<Drivers />} />

          {/* 🔑 Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔒 Protected Tourist Routes */}
          <Route
            path="/my-bookings"
            element={
              <ProtectedTouristRoute>
                <MyBookings />
              </ProtectedTouristRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedTouristRoute>
                <Profile />
              </ProtectedTouristRoute>
            }
          />

          {/* 🔒 Protected Driver Route */}
          <Route
            path="/driver-dashboard"
            element={
              <ProtectedDriverRoute>
                <DriverDashboard />
              </ProtectedDriverRoute>
            }
          />

          {/* 🔒 Protected Admin Route */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </LanguageCurrencyProvider>
  );
}

export default App;