import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

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

  const currentUser = getUser();
  const role = currentUser?.role?.toLowerCase() || 'guest';
  const currentPath = location.pathname;

  const isDriverPage = currentPath.startsWith('/driver-dashboard');
  const isAdminPage = currentPath.startsWith('/admin-dashboard') || currentPath === '/admin';

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    if (onLogout) {
      onLogout();
    } else {
      navigate('/login');
      window.location.reload();
    }
  };

  const isActive = (path) => currentPath === path;
  const avatarLetter = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U';

  /* 🛡️ Admin Bar */
  if (isAdminPage) {
    return (
      <header className="admin-topbar">
        <style>{`
          .admin-topbar { background: #0F2E2B; border-bottom: 1px solid #234E48; padding: 0.8rem 2rem; }
          .admin-topbar-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
          .admin-brand { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; color: #F5EFE1; font-weight: 600; }
          .admin-logout-btn { background: rgba(224,103,43,0.15); color: #F89D7A; border: 1px solid #E0672B; padding: 0.45rem 1.1rem; border-radius: 999px; cursor: pointer; }
        `}</style>
        <div className="admin-topbar-container">
          <Link to="/admin-dashboard" className="admin-brand">🇱🇰 Ceylon <i>Admin</i></Link>
          <button onClick={handleLogout} className="admin-logout-btn">Logout</button>
        </div>
      </header>
    );
  }

  /* 🛺 Driver Bar */
  if (isDriverPage) {
    return (
      <header className="driver-topbar">
        <style>{`
          .driver-topbar { background: #0F2E2B; border-bottom: 1px solid #234E48; padding: 0.8rem 2rem; }
          .driver-topbar-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
          .driver-brand { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; color: #F5EFE1; font-weight: 600; }
          .driver-logout-btn { background: rgba(224,103,43,0.15); color: #F89D7A; border: 1px solid #E0672B; padding: 0.45rem 1.1rem; border-radius: 999px; cursor: pointer; }
        `}</style>
        <div className="driver-topbar-container">
          <Link to="/driver-dashboard" className="driver-brand">🇱🇰 Ceylon <i>Chauffeur</i></Link>
          <button onClick={handleLogout} className="driver-logout-btn">Logout</button>
        </div>
      </header>
    );
  }

  /* 🌐 Main Website Navigation Bar */
  return (
    <nav className="vce-navbar">
      <style>{`
        .vce-navbar { background: #0F2E2B; border-bottom: 1px solid #234E48; padding: 0.9rem 2rem; position: sticky; top: 0; z-index: 1000; font-family: sans-serif; }
        .vce-nav-container { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
        .vce-logo { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; color: #F5EFE1; font-weight: 600; font-size: 1.2rem; }
        .vce-links { display: flex; gap: 0.5rem; list-style: none; margin: 0; padding: 0; }
        .vce-links a { text-decoration: none; color: #A8C4BE; padding: 0.5rem 0.9rem; border-radius: 8px; font-size: 0.9rem; }
        .vce-links a.active { color: #D9A441; background: rgba(217, 164, 65, 0.1); font-weight: 600; }
        
        .vce-user-section { display: flex; align-items: center; gap: 1rem; }
        .vce-btn-login { background: #D9A441; color: #0F2E2B; padding: 0.5rem 1.1rem; border-radius: 999px; text-decoration: none; font-weight: 600; font-size: 0.85rem; }
        .vce-btn-register { background: transparent; color: #F5EFE1; border: 1px solid #234E48; padding: 0.5rem 1.1rem; border-radius: 999px; text-decoration: none; font-weight: 600; font-size: 0.85rem; }
        .vce-btn-register:hover { border-color: #D9A441; color: #D9A441; }
        
        /* 👤 Profile Icon Styles */
        .vce-profile-btn {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.35rem 0.8rem 0.35rem 0.4rem;
          border-radius: 999px;
          border: 1px solid #234E48;
          transition: all 0.2s;
        }
        .vce-profile-btn:hover {
          border-color: #D9A441;
          background: rgba(217, 164, 65, 0.1);
        }
        .vce-profile-btn.active {
          border-color: #D9A441;
        }
        .vce-avatar-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #D9A441;
          color: #0F2E2B;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .vce-profile-name {
          color: #F5EFE1;
          font-size: 0.85rem;
          font-weight: 500;
        }
      `}</style>

      <div className="vce-nav-container">
        <Link to="/" className="vce-logo">🇱🇰 Ceylon Travel</Link>

        <ul className="vce-links">
          <li><Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link></li>
          <li><Link to="/destinations" className={isActive('/destinations') || isActive('/explore') ? 'active' : ''}>Destinations</Link></li>
          <li><Link to="/ai-itinerary" className={isActive('/ai-itinerary') || isActive('/planner') ? 'active' : ''}>AI Itinerary</Link></li>
          <li><Link to="/drivers" className={isActive('/drivers') ? 'active' : ''}>Find Drivers</Link></li>
          {currentUser && role === 'tourist' && (
            <li><Link to="/my-bookings" className={isActive('/my-bookings') ? 'active' : ''}>My Bookings</Link></li>
          )}
        </ul>

        {/* PROFILE ICON / AUTH BUTTONS */}
        <div className="vce-user-section">
          {currentUser ? (
            <Link to="/profile" className={`vce-profile-btn ${isActive('/profile') ? 'active' : ''}`}>
              <div className="vce-avatar-icon">{avatarLetter}</div>
              <span className="vce-profile-name">{currentUser.name || 'Profile'}</span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="vce-btn-login">Sign In</Link>
              <Link to="/register" className="vce-btn-register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;