import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguageCurrency } from '../context/LanguageCurrencyContext';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

const Header = () => {
  const { currency, setCurrency, language, setLanguage } = useLanguageCurrency();

  return (
    <header className="sl-header">
      <style>{`
        .sl-header {
          background: #0F2E2B;
          border-bottom: 1px solid #234E48;
          padding: 0.9rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }

        .sl-logo {
          font-family: 'Fraunces', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #F5EFE1;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sl-logo span {
          color: #D9A441;
        }

        .sl-header-controls {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        /* 🟢 CURRENCY TOGGLE STYLES */
        .sl-currency-toggle {
          display: flex;
          background: #163C37;
          border: 1px solid #234E48;
          border-radius: 20px;
          padding: 2px;
        }

        .sl-curr-btn {
          background: transparent;
          border: none;
          color: #A8C4BE;
          padding: 0.35rem 0.75rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sl-curr-btn.active {
          background: #D9A441;
          color: #0F2E2B;
        }

        /* 🟢 LANGUAGE SELECTOR STYLES */
        .sl-lang-select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .sl-lang-select {
          background: #163C37;
          border: 1px solid #234E48;
          color: #F5EFE1;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .sl-lang-select:hover {
          border-color: #D9A441;
        }

        .sl-lang-select option {
          background: #0F2E2B;
          color: #F5EFE1;
        }
      `}</style>

      {/* Logo */}
      <Link to="/" className="sl-logo">
        🌴 Ceylon <span>Explore</span>
      </Link>

      {/* Controls Container */}
      <div className="sl-header-controls">
        
        {/* 🟢 Currency Toggle (USD / LKR) */}
        <div className="sl-currency-toggle" title="Select Currency">
          <button
            className={`sl-curr-btn ${currency === 'USD' ? 'active' : ''}`}
            onClick={() => setCurrency('USD')}
          >
            $ USD
          </button>
          <button
            className={`sl-curr-btn ${currency === 'LKR' ? 'active' : ''}`}
            onClick={() => setCurrency('LKR')}
          >
            Rs LKR
          </button>
        </div>

        {/* 🟢 Language Select (English, French, German) */}
        <div className="sl-lang-select-wrapper">
          <select
            className="sl-lang-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label="Select Language"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>
        </div>

      </div>
    </header>
  );
};

export default Header;