import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', background: '#0f172a', color: '#fff' }}>
      <h2>
        <Link to="/" style={{ color: '#38bdf8', textDecoration: 'none' }}>🌴 ExploreLanka</Link>
      </h2>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
        <Link to="/explore" style={{ color: '#fff', textDecoration: 'none' }}>Explore</Link>
        <Link to="/planner" style={{ color: '#fff', textDecoration: 'none' }}>AI Planner</Link>
        <Link to="/drivers" style={{ color: '#fff', textDecoration: 'none' }}>Drivers</Link>
        
        {token ? (
          <>
            <Link to="/dashboard" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>Dashboard</Link>
            <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ background: '#0284c7', color: '#fff', padding: '0.5rem 1rem', borderRadius: '5px', textDecoration: 'none' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;