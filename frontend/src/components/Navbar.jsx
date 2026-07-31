import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  // User Data ආරක්ෂිතව ලබා ගැනීම
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

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.9rem 2rem',
      background: '#0f172a',
      color: '#fff',
      borderBottom: '1px solid #1e293b'
    }}>
      {/* 1. Left Side Logo */}
      <Link to="/" style={{ textDecoration: 'none', color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold' }}>
        🌴 ExploreLanka
      </Link>

      {/* 2. Middle Navigation Links (Role එක අනුව සකස් කර ඇත) */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>
          Home
        </Link>

        {/* 🟢 Guest (Log වී නැති අය) හෝ Tourist ලාට පමණක් පෙනෙන Links */}
        {(!user || user.role === 'tourist') && (
          <>
            <Link to="/places" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>
              📍 Destinations
            </Link>
            <Link to="/itinerary" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>
              🤖 AI Itinerary
            </Link>
            <Link to="/drivers" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>
              🛺 Find Drivers
            </Link>
            {user && user.role === 'tourist' && (
              <Link to="/my-bookings" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>
                📅 My Bookings
              </Link>
            )}
          </>
        )}

        {/* 🟢 Admin කෙනෙක්ට පමණක් පෙනෙන Link */}
        {user && user.role === 'admin' && (
          <Link to="/admin" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>
            ⚙️ Admin Panel
          </Link>
        )}

        {/* 🟢 Driver කෙනෙක්ට පමණක් පෙනෙන Link */}
        {user && user.role === 'driver' && (
          <Link to="/driver-dashboard" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>
            🛺 Driver Dashboard
          </Link>
        )}
      </div>

      {/* 3. Right Side User Info & Logout Button */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              👤 {user.name} ({user.role?.toUpperCase()})
            </span>

            <button
              onClick={handleLogout}
              style={{
                background: '#dc2626',
                color: '#fff',
                border: 'none',
                padding: '0.4rem 0.8rem',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.85rem'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          /* Log වී නැති විට (Guest) */
          <>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none', padding: '0.4rem 0.8rem', border: '1px solid #38bdf8', borderRadius: '5px', fontSize: '0.9rem' }}>
              Login
            </Link>
            <Link to="/register" style={{ color: '#0f172a', background: '#38bdf8', textDecoration: 'none', padding: '0.4rem 0.8rem', borderRadius: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;