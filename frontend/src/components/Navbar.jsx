import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600&display=swap');

.sl-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 2rem;
  background: rgba(14, 27, 25, 0.92);
  backdrop-filter: blur(10px);
  color: #F3ECDC;
  border-bottom: 1px solid rgba(243,236,220,0.1);
  font-family: 'Inter', sans-serif;
}

.sl-nav-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 600;
  font-size: 1.35rem;
  color: #F3ECDC;
  letter-spacing: 0.01em;
  white-space: nowrap;
}
.sl-nav-logo .mark { color: #D9A544; font-style: normal; }

.sl-nav-links {
  display: flex;
  gap: 1.7rem;
  align-items: center;
}

.sl-nav-link {
  position: relative;
  color: #C9BFA8;
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 500;
  padding: 0.3rem 0;
  transition: color 0.2s ease;
  white-space: nowrap;
}
.sl-nav-link::after {
  content: '';
  position: absolute;
  left: 0; bottom: -2px;
  width: 0; height: 1px;
  background: #D9A544;
  transition: width 0.25s ease;
}
.sl-nav-link:hover { color: #F3ECDC; }
.sl-nav-link:hover::after { width: 100%; }
.sl-nav-link:focus-visible { outline: 2px solid #D9A544; outline-offset: 3px; border-radius: 2px; }

.sl-nav-right {
  display: flex;
  gap: 0.9rem;
  align-items: center;
}

.sl-role-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Space Mono', monospace;
  font-size: 0.72rem;
  color: #8FA39D;
  border: 1px dashed rgba(217,165,68,0.5);
  border-radius: 999px;
  padding: 0.32rem 0.8rem;
  white-space: nowrap;
}
.sl-role-pill .role-tag { color: #D9A544; letter-spacing: 0.05em; }

.sl-btn-logout {
  background: transparent;
  color: #E08D75;
  border: 1px solid rgba(224,141,117,0.6);
  padding: 0.42rem 0.9rem;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.82rem;
  font-family: 'Inter', sans-serif;
  transition: background 0.2s ease, color 0.2s ease;
}
.sl-btn-logout:hover { background: #E08D75; color: #10201F; }
.sl-btn-logout:focus-visible { outline: 2px solid #E08D75; outline-offset: 2px; }

.sl-btn-login {
  color: #F3ECDC;
  text-decoration: none;
  padding: 0.42rem 0.9rem;
  border: 1px solid rgba(217,165,68,0.6);
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: border-color 0.2s ease, color 0.2s ease;
}
.sl-btn-login:hover { border-color: #D9A544; color: #D9A544; }

.sl-btn-register {
  color: #10201F;
  background: #D9A544;
  text-decoration: none;
  padding: 0.42rem 0.9rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.85rem;
  border: 1px solid #D9A544;
  transition: background 0.2s ease, transform 0.2s ease;
}
.sl-btn-register:hover { background: #F3ECDC; border-color: #F3ECDC; transform: translateY(-1px); }

.sl-nav-toggle {
  display: none;
  background: transparent;
  border: 1px solid rgba(243,236,220,0.25);
  color: #F3ECDC;
  border-radius: 6px;
  width: 38px;
  height: 34px;
  cursor: pointer;
  font-size: 1.1rem;
  align-items: center;
  justify-content: center;
}

@media (max-width: 900px) {
  .sl-nav { flex-wrap: wrap; padding: 0.8rem 1.2rem; }
  .sl-nav-toggle { display: flex; }
  .sl-nav-links {
    order: 3;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.9rem;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, margin-top 0.3s ease;
    margin-top: 0;
  }
  .sl-nav-links.open { max-height: 400px; margin-top: 1rem; }
  .sl-nav-right { gap: 0.6rem; }
  .sl-role-pill span.role-label { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .sl-nav * { transition: none !important; }
}
`;

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
    <nav className="sl-nav">
      <style>{styles}</style>

      {/* Logo */}
      <Link to="/" className="sl-nav-logo">
        <span className="mark">🌴</span> ExploreLanka
      </Link>

      {/* Mobile toggle */}
      <button
        className="sl-nav-toggle"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Middle nav links */}
      <div className={`sl-nav-links${menuOpen ? ' open' : ''}`}>
        <Link to="/" className="sl-nav-link" onClick={() => setMenuOpen(false)}>
          Home
        </Link>

        {(!user || user.role === 'tourist') && (
          <>
            <Link to="/places" className="sl-nav-link" onClick={() => setMenuOpen(false)}>
              📍 Destinations
            </Link>
            <Link to="/itinerary" className="sl-nav-link" onClick={() => setMenuOpen(false)}>
              🤖 AI Itinerary
            </Link>
            <Link to="/drivers" className="sl-nav-link" onClick={() => setMenuOpen(false)}>
              🛺 Find Drivers
            </Link>
            {user && user.role === 'tourist' && (
              <Link to="/my-bookings" className="sl-nav-link" onClick={() => setMenuOpen(false)}>
                📅 My Bookings
              </Link>
            )}
          </>
        )}

        {user && user.role === 'admin' && (
          <Link to="/admin" className="sl-nav-link" onClick={() => setMenuOpen(false)}>
            ⚙️ Admin Panel
          </Link>
        )}

        {user && user.role === 'driver' && (
          <Link to="/driver-dashboard" className="sl-nav-link" onClick={() => setMenuOpen(false)}>
            🛺 Driver Dashboard
          </Link>
        )}
      </div>

      {/* Right side: user info & auth actions */}
      <div className="sl-nav-right">
        {user ? (
          <>
            <span className="sl-role-pill">
              👤 {user.name} <span className="role-label">·</span>
              <span className="role-tag">{user.role?.toUpperCase()}</span>
            </span>

            <button className="sl-btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="sl-btn-login">
              Login
            </Link>
            <Link to="/register" className="sl-btn-register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;