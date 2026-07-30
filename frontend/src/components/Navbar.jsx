import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  // sessionStorage සහ localStorage දෙකෙන්ම User Data ඇත්දැයි ආරක්ෂිතව Check කිරීම
  const getUser = () => {
    try {
      const sessionUser = sessionStorage.getItem('user');
      if (sessionUser) return JSON.parse(sessionUser);

      const localUser = localStorage.getItem('user');
      if (localUser) return JSON.parse(localUser);
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
    return null;
  };

  const user = getUser();

  // Logout Function එක
  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/login');
    window.location.reload(); // Navbar එක Refresh කිරීම සඳහා
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      background: '#0f172a',
      color: '#fff',
      borderBottom: '1px solid #1e293b'
    }}>
      {/* 1. Logo */}
      <Link to="/" style={{ textDecoration: 'none', color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold' }}>
        🌴 ExploreLanka
      </Link>

      {/* 2. Navigation / Authentication Buttons */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
          /* Logged In වී සිටින විට පෙන්වන Buttons */
          <>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              👤 {user.name} ({user.role?.toUpperCase()})
            </span>

            {user.role === 'admin' && (
              <Link to="/admin" style={{ color: '#fff', textDecoration: 'none', padding: '0.4rem 0.8rem', background: '#0284c7', borderRadius: '5px', fontSize: '0.9rem' }}>
                ⚙️ Admin Panel
              </Link>
            )}

            {user.role === 'driver' && (
              <Link to="/driver-dashboard" style={{ color: '#fff', textDecoration: 'none', padding: '0.4rem 0.8rem', background: '#16a34a', borderRadius: '5px', fontSize: '0.9rem' }}>
                🛺 Driver Dashboard
              </Link>
            )}

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
                fontSize: '0.9rem'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          /* Logged In වී නැති විට (Guest) පෙන්වන Buttons */
          <>
            <Link
              to="/login"
              style={{
                color: '#fff',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                border: '1px solid #38bdf8',
                borderRadius: '5px',
                fontSize: '0.9rem'
              }}
            >
              Login
            </Link>

            <Link
              to="/register"
              style={{
                color: '#0f172a',
                background: '#38bdf8',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '5px',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;