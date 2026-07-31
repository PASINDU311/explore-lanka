import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // SessionStorage හෝ LocalStorage දෙකෙන්ම User ව පරික්ෂා කිරීම
  const getUser = () => {
    try {
      const sessionUser = sessionStorage.getItem('user');
      if (sessionUser) return JSON.parse(sessionUser);

      const localUser = localStorage.getItem('user');
      if (localUser) return JSON.parse(localUser);
    } catch (e) {
      console.error('Error reading user in Navbar:', e);
    }
    return null;
  };

  const currentUser = getUser();
  const role = currentUser?.role?.toLowerCase() || 'guest';
  const currentPath = location.pathname;

  // Driver සහ Admin Page පරික්ෂාව
  const isDriverPage = currentPath.startsWith('/driver');
  const isAdminPage = currentPath.startsWith('/admin');

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

  /* ==========================================================
     🛡️ 1. ADMIN DASHBOARD - MINIMAL TOP BAR (NO NAV LINKS)
     ========================================================== */
  if (isAdminPage) {
    return (
      <header className="admin-topbar">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');

          .admin-topbar {
            --ink: #0F2E2B;
            --panel-edge: #234E48;
            --paper: #F5EFE1;
            --gold: #D9A441;
            --coral: #E0672B;

            background: var(--ink);
            border-bottom: 1px solid var(--panel-edge);
            padding: 0.8rem 2rem;
            position: sticky;
            top: 0;
            z-index: 1000;
            font-family: 'Inter', sans-serif;
          }

          .admin-topbar-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .admin-brand {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            text-decoration: none;
          }
          .admin-brand-icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: rgba(224, 103, 43, 0.15);
            border: 1px solid var(--coral);
            color: #F89D7A;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
          }
          .admin-brand-text {
            font-family: 'Fraunces', serif;
            font-size: 1.15rem;
            font-weight: 600;
            color: var(--paper);
          }
          .admin-brand-text em {
            font-style: italic;
            color: #F89D7A;
            font-weight: 400;
          }

          .admin-actions {
            display: flex;
            align-items: center;
            gap: 0.8rem;
          }

          .admin-badge {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.08em;
            padding: 0.35rem 0.85rem;
            border-radius: 999px;
            background: rgba(224, 103, 43, 0.15);
            color: #F89D7A;
            border: 1px solid var(--coral);
            display: flex;
            align-items: center;
            gap: 0.4rem;
          }

          .admin-logout-btn {
            font-size: 0.82rem;
            font-weight: 600;
            padding: 0.45rem 1.1rem;
            border-radius: 999px;
            cursor: pointer;
            background: rgba(224, 103, 43, 0.15);
            color: #F89D7A;
            border: 1px solid var(--coral);
            transition: all 0.2s ease;
          }
          .admin-logout-btn:hover {
            background: var(--coral);
            color: var(--paper);
          }
        `}</style>

        <div className="admin-topbar-container">
          {/* Logo / Brand Name */}
          <Link to="/admin-dashboard" className="admin-brand">
            <div className="admin-brand-icon">🇱🇰</div>
            <span className="admin-brand-text">Ceylon <em>Admin</em></span>
          </Link>

          {/* Action Buttons: ADMIN Badge + Logout Button */}
          <div className="admin-actions">
            <span className="admin-badge">
              🛡️ ADMIN
            </span>
            <button onClick={handleLogout} className="admin-logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>
    );
  }

  /* ==========================================================
     🛺 2. DRIVER DASHBOARD - MINIMAL TOP BAR (NO NAV LINKS)
     ========================================================== */
  if (isDriverPage) {
    return (
      <header className="driver-topbar">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');

          .driver-topbar {
            --ink: #0F2E2B;
            --panel-edge: #234E48;
            --paper: #F5EFE1;
            --gold: #D9A441;
            --coral: #E0672B;

            background: var(--ink);
            border-bottom: 1px solid var(--panel-edge);
            padding: 0.8rem 2rem;
            position: sticky;
            top: 0;
            z-index: 1000;
            font-family: 'Inter', sans-serif;
          }

          .driver-topbar-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .driver-brand {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            text-decoration: none;
          }
          .driver-brand-icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: rgba(217, 164, 65, 0.15);
            border: 1px solid var(--gold);
            color: var(--gold);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
          }
          .driver-brand-text {
            font-family: 'Fraunces', serif;
            font-size: 1.15rem;
            font-weight: 600;
            color: var(--paper);
          }
          .driver-brand-text em {
            font-style: italic;
            color: var(--gold);
            font-weight: 400;
          }

          .driver-actions {
            display: flex;
            align-items: center;
            gap: 0.8rem;
          }

          .driver-badge {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.08em;
            padding: 0.35rem 0.85rem;
            border-radius: 999px;
            background: rgba(217, 164, 65, 0.15);
            color: var(--gold);
            border: 1px solid var(--gold);
            display: flex;
            align-items: center;
            gap: 0.4rem;
          }

          .driver-logout-btn {
            font-size: 0.82rem;
            font-weight: 600;
            padding: 0.45rem 1.1rem;
            border-radius: 999px;
            cursor: pointer;
            background: rgba(224, 103, 43, 0.15);
            color: #F89D7A;
            border: 1px solid var(--coral);
            transition: all 0.2s ease;
          }
          .driver-logout-btn:hover {
            background: var(--coral);
            color: var(--paper);
          }
        `}</style>

        <div className="driver-topbar-container">
          <Link to="/driver-dashboard" className="driver-brand">
            <div className="driver-brand-icon">🇱🇰</div>
            <span className="driver-brand-text">Ceylon <em>Chauffeur</em></span>
          </Link>

          <div className="driver-actions">
            <span className="driver-badge">
              🛺 DRIVER
            </span>
            <button onClick={handleLogout} className="driver-logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>
    );
  }

  /* ==========================================================
     🌐 3. සාමාන්‍ය TOURIST / MAIN SITE NAVIGATION BAR
     ========================================================== */
  return (
    <nav className="vce-navbar">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');

        .vce-navbar {
          --ink: #0F2E2B;
          --panel-edge: #234E48;
          --paper: #F5EFE1;
          --sage: #A8C4BE;
          --gold: #D9A441;
          --coral: #E0672B;

          background: var(--ink);
          border-bottom: 1px solid var(--panel-edge);
          padding: 0.9rem 2rem;
          position: sticky;
          top: 0;
          z-index: 1000;
          font-family: 'Inter', sans-serif;
        }

        .vce-nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .vce-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
        }
        .vce-logo-icon {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: rgba(217, 164, 65, 0.15);
          border: 1px solid var(--gold);
          color: var(--gold);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Fraunces', serif;
          font-weight: 600;
        }
        .vce-logo-text {
          font-family: 'Fraunces', serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--paper);
        }
        .vce-logo-text em {
          font-style: italic;
          color: var(--gold);
          font-weight: 400;
        }

        .vce-links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .vce-links a {
          text-decoration: none;
          color: var(--sage);
          font-size: 0.88rem;
          font-weight: 500;
          padding: 0.5rem 0.9rem;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .vce-links a:hover {
          color: var(--paper);
          background: rgba(255, 255, 255, 0.05);
        }
        .vce-links a.active {
          color: var(--gold);
          background: rgba(217, 164, 65, 0.1);
          font-weight: 600;
        }

        .vce-user-section {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .vce-role-badge {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          font-weight: 600;
          padding: 0.25rem 0.65rem;
          border-radius: 999px;
          text-transform: uppercase;
        }
        .vce-role-badge.tourist { background: rgba(168, 196, 190, 0.15); color: var(--sage); border: 1px solid var(--panel-edge); }

        .vce-auth-btn {
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.5rem 1.1rem;
          border-radius: 999px;
          cursor: pointer;
          border: none;
        }
        .vce-btn-login { background: var(--gold); color: var(--ink); }
        .vce-btn-logout { background: rgba(224, 103, 43, 0.12); color: #F89D7A; border: 1px solid var(--coral); }
        .vce-btn-logout:hover { background: var(--coral); color: var(--paper); }

        @media (max-width: 768px) {
          .vce-nav-container { flex-direction: column; gap: 1rem; }
          .vce-links { flex-wrap: wrap; justify-content: center; }
        }
      `}</style>

      <div className="vce-nav-container">
        {/* LOGO */}
        <Link to="/" className="vce-logo">
          <div className="vce-logo-icon">🇱🇰</div>
          <span className="vce-logo-text">Ceylon <em>Travel</em></span>
        </Link>

        {/* REGULAR MAIN SITE LINKS */}
        <ul className="vce-links">
          <li><Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link></li>
          <li><Link to="/destinations" className={isActive('/destinations') || isActive('/explore') ? 'active' : ''}>Destinations</Link></li>
          <li><Link to="/ai-itinerary" className={isActive('/ai-itinerary') || isActive('/planner') ? 'active' : ''}>AI Itinerary</Link></li>
          <li><Link to="/drivers" className={isActive('/drivers') ? 'active' : ''}>Find Drivers</Link></li>
          
          {currentUser && role === 'tourist' && (
            <li><Link to="/my-bookings" className={isActive('/my-bookings') ? 'active' : ''}>My Bookings</Link></li>
          )}
        </ul>

        {/* USER PROFILE & LOGOUT SECTION */}
        <div className="vce-user-section">
          {currentUser ? (
            <>
              <span className={`vce-role-badge ${role}`}>
                {role}
              </span>
              <button onClick={handleLogout} className="vce-auth-btn vce-btn-logout">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="vce-auth-btn vce-btn-login">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;