import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 🎯 Added useNavigate
import API from '../services/api';

const DriverIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Drivers = () => {
  const navigate = useNavigate(); // 🎯 Initialize useNavigate
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [bookingData, setBookingData] = useState({ 
    pickupLocation: '', 
    destination: '', 
    date: '', 
    note: '' 
  });

  // 🎯 Helper function to check logged in user
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

  useEffect(() => {
    API.get('/auth/drivers')
      .then((res) => setDrivers(res.data))
      .catch((err) => console.error(err));
  }, []);

  // 🎯 Reserve Button එක Click කරද්දී Authentication Check කිරීම
  const handleReserveClick = (driver) => {
    const user = getUser();

    if (!user) {
      alert('Driver කෙනෙකු වෙන්කරවා ගැනීමට (Reserve) කරුණාකර පළමුව Sign In වන්න.');
      navigate('/login');
      return;
    }

    if (user.role !== 'tourist') {
      alert('Driver කෙනෙකු වෙන්කරවා ගැනීමට ඔබට Tourist ගිණුමක් තිබිය යුතුය.');
      return;
    }

    setSelectedDriver(driver);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/bookings', {
        driverId: selectedDriver._id,
        pickupLocation: bookingData.pickupLocation,
        destination: bookingData.destination,
        date: bookingData.date,
        note: bookingData.note
      });

      alert('Booking Request Sent to Driver Successfully! Check your My Bookings page for updates.');
      setSelectedDriver(null);
      setBookingData({ pickupLocation: '', destination: '', date: '', note: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send booking request');
    }
  };

  return (
    <div className="dr-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');

        .dr-page {
          --ink: #0F2E2B;
          --panel: #163C37;
          --panel-edge: #234E48;
          --paper: #F5EFE1;
          --paper-dim: #D9CFB8;
          --gold: #D9A441;
          --coral: #E0672B;
          --green: #2F6B49;
          --sage: #A8C4BE;
          font-family: 'Inter', sans-serif;
          background: var(--ink);
          color: var(--paper);
          min-height: 100vh;
          padding-bottom: 5rem;
        }

        /* ---------- HERO ---------- */
        .dr-hero {
          position: relative;
          padding: 4rem 1.5rem 5.5rem;
          text-align: center;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 15% -10%, rgba(217,164,65,0.16), transparent 55%),
            radial-gradient(ellipse at 88% 5%, rgba(47,164,160,0.16), transparent 50%),
            var(--ink);
        }
        .dr-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--gold);
        }
        .dr-eyebrow::before, .dr-eyebrow::after {
          content: '';
          width: 22px;
          height: 1px;
          background: var(--gold);
          opacity: 0.6;
        }
        .dr-title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: clamp(2.1rem, 5vw, 3.4rem);
          line-height: 1.08;
          margin: 1rem 0 0.9rem;
        }
        .dr-title em { font-style: italic; font-weight: 500; color: var(--gold); }
        .dr-subtitle {
          max-width: 480px;
          margin: 0 auto;
          color: var(--sage);
          font-size: 1rem;
          line-height: 1.55;
        }
        .dr-wave {
          position: absolute;
          left: 0; right: 0; bottom: -1px;
          width: 100%;
          height: 40px;
          display: block;
        }

        /* ---------- DRIVERS GRID ---------- */
        .dr-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .dr-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .dr-card {
          background: var(--panel);
          border: 1px solid var(--panel-edge);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 16px 32px -12px rgba(0,0,0,0.4);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .dr-card:hover {
          transform: translateY(-3px);
          border-color: var(--gold);
        }

        .dr-card-header {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 1.2rem;
          padding-bottom: 1rem;
          border-bottom: 1px dashed var(--panel-edge);
        }
        .dr-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(217,164,65,0.15);
          border: 1.5px solid var(--gold);
          color: var(--gold);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
        }
        .dr-name {
          font-family: 'Fraunces', serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--paper);
          margin: 0;
        }

        .dr-details {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin-bottom: 1.5rem;
        }
        .dr-detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.88rem;
        }
        .dr-detail-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--sage);
        }
        .dr-detail-val {
          color: var(--paper);
          font-weight: 500;
        }
        .dr-rate-badge {
          background: rgba(47,107,73,0.3);
          border: 1px solid var(--green);
          color: #72DDA2;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 600;
          font-size: 0.82rem;
        }

        .dr-book-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: var(--gold);
          color: var(--ink);
          border: none;
          padding: 0.8rem;
          border-radius: 999px;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.12s ease, filter 0.12s ease;
        }
        .dr-book-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.06);
        }

        /* ---------- MODAL OVERLAY ---------- */
        .dr-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 46, 43, 0.82);
          backdrop-filter: blur(6px);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1.2rem;
          z-index: 1000;
        }

        .dr-modal-ticket {
          background: var(--panel);
          border: 1px solid var(--panel-edge);
          border-radius: 16px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 28px 56px -16px rgba(0,0,0,0.65);
          overflow: hidden;
          animation: modalFadeIn 0.2s ease-out;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }

        .dr-modal-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.1rem 1.4rem;
          background: rgba(15, 46, 43, 0.4);
          border-bottom: 1.5px dashed var(--panel-edge);
        }
        .dr-modal-head span {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--sage);
        }
        .dr-modal-head strong { color: var(--gold); }
        .dr-close-btn {
          background: transparent;
          border: none;
          color: var(--sage);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0.2rem;
          transition: color 0.15s;
        }
        .dr-close-btn:hover { color: var(--paper); }

        .dr-modal-body {
          padding: 1.5rem 1.4rem 1.8rem;
        }

        .dr-modal-title {
          font-family: 'Fraunces', serif;
          font-size: 1.35rem;
          color: var(--paper);
          margin: 0 0 1.2rem;
        }
        .dr-modal-title span { color: var(--gold); }

        .dr-form {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }

        .dr-field label {
          display: block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--sage);
          margin-bottom: 0.45rem;
        }

        .dr-field input,
        .dr-field textarea {
          width: 100%;
          padding: 0.75rem 0.9rem;
          border-radius: 8px;
          border: 1px solid var(--panel-edge);
          background: rgba(15,46,43,0.55);
          color: var(--paper);
          font-family: 'Inter', sans-serif;
          font-size: 0.92rem;
          outline: none;
          transition: border-color 0.15s ease;
          box-sizing: border-box;
        }
        .dr-field input::placeholder,
        .dr-field textarea::placeholder {
          color: var(--sage);
          opacity: 0.5;
        }
        .dr-field input:focus,
        .dr-field textarea:focus {
          border-color: var(--gold);
        }

        .dr-field textarea {
          resize: vertical;
          min-height: 75px;
        }

        .dr-modal-actions {
          display: flex;
          gap: 0.8rem;
          margin-top: 0.5rem;
        }

        .dr-btn-confirm {
          flex: 1;
          background: var(--gold);
          color: var(--ink);
          border: none;
          padding: 0.8rem;
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: filter 0.15s;
        }
        .dr-btn-confirm:hover { filter: brightness(1.06); }

        .dr-btn-cancel {
          background: transparent;
          border: 1px solid var(--panel-edge);
          color: var(--sage);
          padding: 0.8rem 1.2rem;
          border-radius: 999px;
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .dr-btn-cancel:hover {
          background: rgba(224,103,43,0.15);
          border-color: var(--coral);
          color: #F3C6A8;
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="dr-hero">
        <span className="dr-eyebrow">Verified Transport</span>
        <h1 className="dr-title">Book Your <em>Ceylon</em> Chauffeur</h1>
        <p className="dr-subtitle">
          Connect with trusted local drivers for comfortable, private travel across island heritage routes.
        </p>
        <svg className="dr-wave" viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path d="M0,20 C150,38 300,2 450,20 C600,38 750,2 900,20 C1050,38 1150,12 1200,20 L1200,40 L0,40 Z" fill="#0F2E2B" />
        </svg>
      </section>

      {/* DRIVERS CARDS GRID */}
      <div className="dr-container">
        {drivers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--sage)' }}>
            <p>Loading available drivers...</p>
          </div>
        ) : (
          <div className="dr-grid">
            {drivers.map((driver) => (
              <div key={driver._id} className="dr-card">
                <div>
                  <div className="dr-card-header">
                    <div className="dr-avatar">👨‍✈️</div>
                    <div>
                      <h3 className="dr-name">{driver.name}</h3>
                      <span className="dr-detail-label">Verified Chauffeur</span>
                    </div>
                  </div>

                  <div className="dr-details">
                    <div className="dr-detail-item">
                      <span className="dr-detail-label">Vehicle</span>
                      <span className="dr-detail-val">{driver.driverDetails?.vehicleType || 'Standard Vehicle'}</span>
                    </div>

                    <div className="dr-detail-item">
                      <span className="dr-detail-label">License</span>
                      <span className="dr-detail-val">{driver.driverDetails?.licenseNumber || 'Verified'}</span>
                    </div>

                    <div className="dr-detail-item" style={{ marginTop: '0.4rem' }}>
                      <span className="dr-detail-label">Rate / KM</span>
                      <span className="dr-rate-badge">LKR {driver.driverDetails?.pricePerKm || 0}</span>
                    </div>
                  </div>
                </div>

                {/* 🎯 Updated onClick to call handleReserveClick */}
                <button className="dr-book-btn" onClick={() => handleReserveClick(driver)}>
                  <DriverIcon /> Reserve Driver
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOOKING MODAL FORM */}
      {selectedDriver && (
        <div className="dr-modal-overlay">
          <div className="dr-modal-ticket">
            <div className="dr-modal-head">
              <span>Reservation Pass</span>
              <button className="dr-close-btn" onClick={() => setSelectedDriver(null)}>
                <CloseIcon />
              </button>
            </div>

            <div className="dr-modal-body">
              <h3 className="dr-modal-title">Book <span>{selectedDriver.name}</span></h3>

              <form onSubmit={handleBookingSubmit} className="dr-form">
                <div className="dr-field">
                  <label htmlFor="pickupLocation">Pickup Location</label>
                  <input
                    id="pickupLocation"
                    type="text"
                    placeholder="e.g. CMB Airport / Colombo Hotel"
                    required
                    value={bookingData.pickupLocation}
                    onChange={(e) => setBookingData({ ...bookingData, pickupLocation: e.target.value })}
                  />
                </div>

                <div className="dr-field">
                  <label htmlFor="destination">Destination</label>
                  <input
                    id="destination"
                    type="text"
                    placeholder="e.g. Kandy / Ella / Galle"
                    required
                    value={bookingData.destination}
                    onChange={(e) => setBookingData({ ...bookingData, destination: e.target.value })}
                  />
                </div>

                <div className="dr-field">
                  <label htmlFor="travelDate">Travel Date</label>
                  <input
                    id="travelDate"
                    type="date"
                    required
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  />
                </div>

                <div className="dr-field">
                  <label htmlFor="note">Additional Notes / Itinerary Details</label>
                  <textarea
                    id="note"
                    placeholder="Provide special requests or flight details..."
                    value={bookingData.note}
                    onChange={(e) => setBookingData({ ...bookingData, note: e.target.value })}
                  />
                </div>

                <div className="dr-modal-actions">
                  <button type="submit" className="dr-btn-confirm">
                    Confirm Request
                  </button>
                  <button type="button" className="dr-btn-cancel" onClick={() => setSelectedDriver(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;