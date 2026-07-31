import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const STYLE_OPTIONS = [
  { value: 'Culture', label: 'Culture & Heritage' },
  { value: 'Beach & Relaxation', label: 'Beach & Relaxation' },
  { value: 'Adventure & Hiking', label: 'Adventure & Hiking' },
  { value: 'Wildlife Safari', label: 'Wildlife Safari' },
];

const RouteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5" cy="6" r="2.2" /><circle cx="19" cy="18" r="2.2" />
    <path d="M6.7 7.6c0 4 2 5 5 5.4 3.7.5 4.6 1.6 5.2 3" />
  </svg>
);

const Planner = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tripTitle: '',
    durationDays: 3,
    travelStyle: 'Culture',
    estimatedBudgetLKR: 50000
  });

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getAuthToken = () => {
    return (
      localStorage.getItem('token') ||
      sessionStorage.getItem('token') ||
      JSON.parse(localStorage.getItem('user') || '{}')?.token ||
      JSON.parse(sessionStorage.getItem('user') || '{}')?.token ||
      null
    );
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');

    const token = getAuthToken();

    if (!token) {
      alert('Please Login first as a Tourist to generate an AI Travel Plan!');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);

      const res = await API.post('/itineraries/generate', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setItinerary(res.data);
    } catch (err) {
      console.error('Error generating itinerary:', err);
      setError(err.response?.data?.message || 'Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sl-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');

        .sl-page {
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
          padding-bottom: 4rem;
        }

        /* ---------- HERO ---------- */
        .sl-hero {
          position: relative;
          padding: 4rem 1.5rem 5.5rem;
          text-align: center;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 15% -10%, rgba(217,164,65,0.16), transparent 55%),
            radial-gradient(ellipse at 88% 5%, rgba(47,164,160,0.16), transparent 50%),
            var(--ink);
        }
        .sl-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--gold);
        }
        .sl-eyebrow::before, .sl-eyebrow::after {
          content: '';
          width: 22px;
          height: 1px;
          background: var(--gold);
          opacity: 0.6;
        }
        .sl-title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: clamp(2.1rem, 5vw, 3.4rem);
          line-height: 1.08;
          margin: 1rem 0 0.9rem;
        }
        .sl-title em { font-style: italic; font-weight: 500; color: var(--gold); }
        .sl-subtitle {
          max-width: 460px;
          margin: 0 auto;
          color: var(--sage);
          font-size: 1rem;
          line-height: 1.55;
        }
        .sl-wave {
          position: absolute;
          left: 0; right: 0; bottom: -1px;
          width: 100%;
          height: 40px;
          display: block;
        }

        /* ---------- TICKET / FORM ---------- */
        .sl-ticket-wrap {
          max-width: 760px;
          margin: -3.4rem auto 0;
          padding: 0 1.2rem;
          position: relative;
          z-index: 2;
        }
        .sl-ticket {
          background: var(--panel);
          border: 1px solid var(--panel-edge);
          border-radius: 16px;
          box-shadow: 0 24px 48px -20px rgba(0,0,0,0.55);
          overflow: hidden;
        }
        .sl-ticket-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.4rem;
          border-bottom: 1.5px dashed var(--panel-edge);
        }
        .sl-ticket-head span {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--sage);
        }
        .sl-ticket-head strong { color: var(--gold); }

        .sl-form {
          display: grid;
          gap: 1.2rem;
          padding: 1.6rem 1.4rem 1.8rem;
        }
        .sl-field label {
          display: block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--sage);
          margin-bottom: 0.45rem;
        }
        .sl-field input,
        .sl-field select {
          width: 100%;
          padding: 0.75rem 0.9rem;
          border-radius: 8px;
          border: 1px solid var(--panel-edge);
          background: rgba(15,46,43,0.55);
          color: var(--paper);
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .sl-field input::placeholder { color: var(--sage); opacity: 0.6; }
        .sl-field input:focus,
        .sl-field select:focus { border-color: var(--gold); }
        .sl-field select option { background: var(--panel); color: var(--paper); }

        .sl-row3 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
        }

        .sl-error {
          background: rgba(224,103,43,0.14);
          border: 1px solid rgba(224,103,43,0.4);
          color: #F3C6A8;
          padding: 0.8rem 1rem;
          border-radius: 8px;
          font-size: 0.88rem;
        }

        .sl-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          background: var(--gold);
          color: var(--ink);
          border: none;
          padding: 0.85rem;
          border-radius: 999px;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 0.2rem;
          transition: transform 0.12s ease, filter 0.12s ease;
        }
        .sl-submit:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.04); }
        .sl-submit:disabled { background: var(--panel-edge); color: var(--sage); cursor: not-allowed; }

        /* ---------- ITINERARY RESULT ---------- */
        .sl-result {
          max-width: 760px;
          margin: 2.5rem auto 0;
          padding: 0 1.2rem;
        }
        .sl-result-card {
          background: var(--paper);
          border-radius: 14px;
          padding: 1.6rem 1.6rem 1.8rem;
          box-shadow: 0 20px 40px -20px rgba(0,0,0,0.5);
        }
        .sl-result-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
          padding-bottom: 1.2rem;
          border-bottom: 1.5px dashed #C9BC9E;
        }
        .sl-result-title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 1.5rem;
          color: var(--ink);
          margin: 0 0 0.35rem;
        }
        .sl-result-meta {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.78rem;
          color: #7A6F52;
          margin: 0;
        }
        .sl-result-meta b { color: var(--green); }
        .sl-driver-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--coral);
          color: #fff;
          border: none;
          padding: 0.65rem 1.2rem;
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          white-space: nowrap;
        }
        .sl-driver-btn:hover { filter: brightness(1.06); }

        /* Route timeline */
        .sl-route {
          position: relative;
          margin-top: 1.5rem;
          padding-left: 2.1rem;
        }
        .sl-route::before {
          content: '';
          position: absolute;
          left: 9px;
          top: 6px;
          bottom: 6px;
          width: 0;
          border-left: 2px dashed #C9BC9E;
        }
        .sl-day {
          position: relative;
          margin-bottom: 1.5rem;
        }
        .sl-day:last-child { margin-bottom: 0; }
        .sl-day-marker {
          position: absolute;
          left: -2.1rem;
          top: 0;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--ink);
          color: var(--gold);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          font-weight: 700;
          border: 2px solid var(--gold);
        }
        .sl-day-head {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 1.05rem;
          color: var(--ink);
          margin: 0 0 0.2rem;
        }
        .sl-day-note {
          font-size: 0.86rem;
          color: #6B7C74;
          font-style: italic;
          margin: 0 0 0.7rem;
        }
        .sl-places {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.65rem;
        }
        .sl-place-chip {
          background: #fff;
          border: 1px solid #E4DBC5;
          border-radius: 8px;
          padding: 0.65rem 0.8rem;
        }
        .sl-place-chip strong {
          display: block;
          font-size: 0.9rem;
          color: var(--ink);
          margin-bottom: 0.15rem;
        }
        .sl-place-chip span {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          color: #8A7E5E;
        }
        .sl-free-time {
          font-size: 0.85rem;
          color: #9AA6A0;
          margin: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .sl-submit, .sl-driver-btn { transition: none; }
        }
      `}</style>

      {/* HERO */}
      <section className="sl-hero">
        <span className="sl-eyebrow">Plan Your Journey</span>
        <h1 className="sl-title">Design Your <em>Ceylon</em> Itinerary</h1>
        <p className="sl-subtitle">
          Tell us how you like to travel — we'll lay out the days, the stops, and the route between them.
        </p>
        <svg className="sl-wave" viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path d="M0,20 C150,38 300,2 450,20 C600,38 750,2 900,20 C1050,38 1150,12 1200,20 L1200,40 L0,40 Z" fill="#0F2E2B" />
        </svg>
      </section>

      {/* TICKET / FORM */}
      <div className="sl-ticket-wrap">
        <div className="sl-ticket">
          <div className="sl-ticket-head">
            <span>Itinerary Request</span>
            <span><strong>Ceylon</strong> · Tourist Board</span>
          </div>
          <form onSubmit={handleGenerate} className="sl-form">
            {error && <div className="sl-error">{error}</div>}

            <div className="sl-field">
              <label htmlFor="tripTitle">Trip name</label>
              <input
                id="tripTitle"
                type="text"
                name="tripTitle"
                placeholder="e.g. My Magical Coastal & Heritage Tour"
                value={formData.tripTitle}
                onChange={handleChange}
                required
              />
            </div>

            <div className="sl-row3">
              <div className="sl-field">
                <label htmlFor="durationDays">Duration (days)</label>
                <input
                  id="durationDays"
                  type="number"
                  name="durationDays"
                  min="1"
                  max="14"
                  value={formData.durationDays}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="sl-field">
                <label htmlFor="travelStyle">Travel style</label>
                <select id="travelStyle" name="travelStyle" value={formData.travelStyle} onChange={handleChange}>
                  {STYLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="sl-field">
                <label htmlFor="estimatedBudgetLKR">Budget (LKR)</label>
                <input
                  id="estimatedBudgetLKR"
                  type="number"
                  name="estimatedBudgetLKR"
                  value={formData.estimatedBudgetLKR}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="sl-submit">
              <RouteIcon />
              {loading ? 'Generating your route…' : 'Generate itinerary'}
            </button>
          </form>
        </div>
      </div>

      {/* GENERATED ITINERARY */}
      {itinerary && (
        <div className="sl-result">
          <div className="sl-result-card">
            <div className="sl-result-head">
              <div>
                <h3 className="sl-result-title">{itinerary.tripTitle}</h3>
                <p className="sl-result-meta">
                  {itinerary.travelStyle} · Budget <b>LKR {Number(itinerary.estimatedBudgetLKR).toLocaleString()}</b>
                </p>
              </div>
              <button className="sl-driver-btn" onClick={() => navigate('/drivers')}>
                <RouteIcon /> Find & book a driver
              </button>
            </div>

            <div className="sl-route">
              {itinerary.dayPlans && itinerary.dayPlans.map((day) => (
                <div key={day.dayNumber} className="sl-day">
                  <div className="sl-day-marker">{day.dayNumber}</div>
                  <h4 className="sl-day-head">Day {day.dayNumber}</h4>
                  {day.note && <p className="sl-day-note">{day.note}</p>}

                  {day.placesToVisit && day.placesToVisit.length > 0 ? (
                    <div className="sl-places">
                      {day.placesToVisit.map((place, idx) => (
                        <div key={place._id || idx} className="sl-place-chip">
                          <strong>{place.name || place.title}</strong>
                          <span>{place.district || 'Sri Lanka'}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="sl-free-time">Free time for leisure and exploring nearby attractions.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;