import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguageCurrency } from '../context/LanguageCurrencyContext'; // 👈 1. Import Context Hook

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🟢 Language & Currency Context
  const { currency, setCurrency, language, setLanguage } = useLanguageCurrency(); // 👈 2. Get Context values

  // 🟢 AI Itinerary Count State & Listener
  const [itineraryCount, setItineraryCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      try {
        const saved = localStorage.getItem('ai_itinerary');
        const items = saved ? JSON.parse(saved) : [];
        setItineraryCount(items.length);
      } catch (e) {
        console.error('Error reading itinerary count:', e);
        setItineraryCount(0);
      }
    };

    updateCount(); // Initial count load

    // Custom event සහ Storage event මගින් Real-time update ලබා ගැනීම
    window.addEventListener('itineraryUpdated', updateCount);
    window.addEventListener('storage', updateCount);

    return () => {
      window.removeEventListener('itineraryUpdated', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

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

  // 🟢 Currency & Language Controls Component
  const renderControls = () => (
    <div className="vce-controls-group">
      {/* USD / LKR Currency Switcher */}
      <div className="vce-currency-toggle">
        <button
          type="button"
          className={`vce-curr-btn ${currency === 'USD' ? 'active' : ''}`}
          onClick={() => setCurrency('USD')}
        >
          USD
        </button>
        <button
          type="button"
          className={`vce-curr-btn ${currency === 'LKR' ? 'active' : ''}`}
          onClick={() => setCurrency('LKR')}
        >
          LKR
        </button>
      </div>

      {/* Language Switcher */}
      <select
        className="vce-lang-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="en">🇬🇧 EN</option>
        <option value="fr">🇫🇷 FR</option>
        <option value="de">🇩🇪 DE</option>
      </select>
    </div>
  );

  /* 🛡️ Admin Bar */
  if (isAdminPage) {
    return (
      <header className="admin-topbar">
        <style>{`
          .admin-topbar { background: #0F2E2B; border-bottom: 1px solid #234E48; padding: 0.8rem 2rem; }
          .admin-topbar-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
          .admin-brand { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; color: #F5EFE1; font-weight: 600; }
          .admin-right { display: flex; align-items: center; gap: 1rem; }
          .admin-logout-btn { background: rgba(224,103,43,0.15); color: #F89D7A; border: 1px solid #E0672B; padding: 0.45rem 1.1rem; border-radius: 999px; cursor: pointer; }
          
          /* Switcher Styles */
          .vce-controls-group { display: flex; align-items: center; gap: 0.6rem; }
          .vce-currency-toggle { display: flex; background: #163C37; border: 1px solid #234E48; border-radius: 20px; padding: 2px; }
          .vce-curr-btn { background: transparent; color: #A8C4BE; border: none; padding: 0.25rem 0.55rem; border-radius: 16px; font-size: 0.72rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
          .vce-curr-btn.active { background: #D9A441; color: #0F2E2B; }
          .vce-lang-select { background: #163C37; border: 1px solid #234E48; color: #F5EFE1; padding: 0.3rem 0.5rem; border-radius: 8px; font-size: 0.78rem; cursor: pointer; outline: none; }
        `}</style>
        <div className="admin-topbar-container">
          <Link to="/admin-dashboard" className="admin-brand">🇱🇰 Ceylon <i>Admin</i></Link>
          <div className="admin-right">
            {renderControls()}
            <button onClick={handleLogout} className="admin-logout-btn">Logout</button>
          </div>
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
          .driver-right { display: flex; align-items: center; gap: 1rem; }
          .driver-logout-btn { background: rgba(224,103,43,0.15); color: #F89D7A; border: 1px solid #E0672B; padding: 0.45rem 1.1rem; border-radius: 999px; cursor: pointer; }

          /* Switcher Styles */
          .vce-controls-group { display: flex; align-items: center; gap: 0.6rem; }
          .vce-currency-toggle { display: flex; background: #163C37; border: 1px solid #234E48; border-radius: 20px; padding: 2px; }
          .vce-curr-btn { background: transparent; color: #A8C4BE; border: none; padding: 0.25rem 0.55rem; border-radius: 16px; font-size: 0.72rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
          .vce-curr-btn.active { background: #D9A441; color: #0F2E2B; }
          .vce-lang-select { background: #163C37; border: 1px solid #234E48; color: #F5EFE1; padding: 0.3rem 0.5rem; border-radius: 8px; font-size: 0.78rem; cursor: pointer; outline: none; }
        `}</style>
        <div className="driver-topbar-container">
          <Link to="/driver-dashboard" className="driver-brand">🇱🇰 Ceylon <i>Chauffeur</i></Link>
          <div className="driver-right">
            {renderControls()}
            <button onClick={handleLogout} className="driver-logout-btn">Logout</button>
          </div>
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
        .vce-links a { 
          text-decoration: none; 
          color: #A8C4BE; 
          padding: 0.5rem 0.9rem; 
          border-radius: 8px; 
          font-size: 0.9rem; 
          display: inline-flex; 
          align-items: center; 
          gap: 0.4rem; 
          transition: all 0.2s ease;
        }
        .vce-links a.active { color: #D9A441; background: rgba(217, 164, 65, 0.1); font-weight: 600; }
        
        /* 🟡 Itinerary Badge Style */
        .vce-itinerary-badge {
          background: #D9A441;
          color: #0F2E2B;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
          min-width: 18px;
          height: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }

        .vce-user-section { display: flex; align-items: center; gap: 1rem; }
        
        /* 🟢 Currency & Language Switchers Styling */
        .vce-controls-group { display: flex; align-items: center; gap: 0.6rem; }
        .vce-currency-toggle { display: flex; background: #163C37; border: 1px solid #234E48; border-radius: 20px; padding: 2px; }
        .vce-curr-btn { background: transparent; color: #A8C4BE; border: none; padding: 0.3rem 0.65rem; border-radius: 16px; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .vce-curr-btn.active { background: #D9A441; color: #0F2E2B; }
        .vce-lang-select { background: #163C37; border: 1px solid #234E48; color: #F5EFE1; padding: 0.35rem 0.6rem; border-radius: 8px; font-size: 0.8rem; cursor: pointer; outline: none; }
        
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
          
          {/* AI Itinerary with Real-time Badge Count */}
          <li>
            <Link to="/ai-itinerary" className={isActive('/ai-itinerary') || isActive('/planner') ? 'active' : ''}>
              <span>AI Itinerary</span>
              {itineraryCount > 0 && (
                <span className="vce-itinerary-badge">{itineraryCount}</span>
              )}
            </Link>
          </li>

          <li><Link to="/drivers" className={isActive('/drivers') ? 'active' : ''}>Find Drivers</Link></li>
          {currentUser && role === 'tourist' && (
            <li><Link to="/my-bookings" className={isActive('/my-bookings') ? 'active' : ''}>My Bookings</Link></li>
          )}
        </ul>

        {/* CONTROLS & PROFILE ICON / AUTH BUTTONS */}
        <div className="vce-user-section">
          {/* 🟢 Currency & Language Switchers */}
          {renderControls()}

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