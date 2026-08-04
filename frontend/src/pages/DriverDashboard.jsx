import React, { useEffect, useState, useRef } from 'react';
import API from '../services/api';

const TouristIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CrossIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const MessageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const DriverDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // CHAT STATES
  const [activeChatBooking, setActiveChatBooking] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchDriverBookings();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ACTIVE CHAT එක වෙනස් වන විට/ඕපන් වන විට Messages Fetch කිරීම සහ Real-time Refresh (Polling)
  useEffect(() => {
    let interval;
    if (activeChatBooking) {
      fetchMessages(activeChatBooking._id);

      // තත්පර 3කට වරක් අලුත් Messages තිබේදැයි පරීක්ෂා කිරීම (Polling)
      interval = setInterval(() => {
        fetchMessages(activeChatBooking._id);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [activeChatBooking]);

  const fetchDriverBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get('/bookings/driver-bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching driver bookings:', err);
      setError('Failed to load booking requests.');
    } finally {
      setLoading(false);
    }
  };

  // BACKEND එකෙන් MESSAGES GET කිරීම
  const fetchMessages = async (bookingId) => {
    try {
      const res = await API.get(`/bookings/${bookingId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  // DRIVER විසින් BACKEND එකට MESSAGE SEND කිරීම
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatBooking) return;

    try {
      const res = await API.post(`/bookings/${activeChatBooking._id}/messages`, {
        sender: 'driver',
        text: newMessage
      });

      setMessages((prev) => [...prev, res.data]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Message sending failed');
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await API.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      alert(`Booking request ${newStatus === 'accepted' ? 'ACCEPTED ✅' : 'REJECTED ❌'} successfully!`);
      fetchDriverBookings();
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.response?.data?.message || 'Failed to update booking status.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
      case 'approved':
      case 'confirmed':
        return { label: 'ACCEPTED', bg: 'rgba(47, 107, 73, 0.35)', border: '#2F6B49', color: '#72DDA2' };
      case 'rejected':
        return { label: 'REJECTED', bg: 'rgba(224, 103, 43, 0.25)', border: '#E0672B', color: '#F89D7A' };
      default:
        return { label: 'PENDING', bg: 'rgba(217, 164, 65, 0.25)', border: '#D9A441', color: '#F2C975' };
    }
  };

  return (
    <div className="dd-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

        .dd-page {
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

        .dd-hero {
          position: relative;
          padding: 4rem 1.5rem 5.5rem;
          text-align: center;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 15% -10%, rgba(217,164,65,0.16), transparent 55%),
            radial-gradient(ellipse at 88% 5%, rgba(47,164,160,0.16), transparent 50%),
            var(--ink);
        }
        .dd-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--gold);
        }
        .dd-eyebrow::before, .dd-eyebrow::after {
          content: '';
          width: 22px;
          height: 1px;
          background: var(--gold);
          opacity: 0.6;
        }
        .dd-title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: clamp(2.1rem, 5vw, 3.2rem);
          line-height: 1.08;
          margin: 1rem 0 0.9rem;
        }
        .dd-title em { font-style: italic; font-weight: 500; color: var(--gold); }
        .dd-subtitle {
          max-width: 480px;
          margin: 0 auto;
          color: var(--sage);
          font-size: 1rem;
          line-height: 1.55;
        }
        .dd-wave {
          position: absolute;
          left: 0; right: 0; bottom: -1px;
          width: 100%;
          height: 40px;
          display: block;
        }

        .dd-container {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .dd-status-box {
          text-align: center;
          padding: 3rem 1.5rem;
          background: var(--panel);
          border: 1px dashed var(--panel-edge);
          border-radius: 16px;
          color: var(--sage);
        }
        .dd-error-box {
          background: rgba(224, 103, 43, 0.15);
          border: 1px solid var(--coral);
          color: #F89D7A;
          padding: 1rem 1.2rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          font-size: 0.92rem;
          text-align: center;
        }

        .dd-card-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .dd-ticket {
          background: var(--panel);
          border: 1px solid var(--panel-edge);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 16px 32px -12px rgba(0,0,0,0.4);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .dd-ticket:hover {
          transform: translateY(-2px);
          border-color: rgba(217, 164, 65, 0.4);
        }

        .dd-ticket-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.2rem 1.5rem;
          background: rgba(15, 46, 43, 0.45);
          border-bottom: 1.5px dashed var(--panel-edge);
        }
        .dd-tourist-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .dd-tourist-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(217,164,65,0.12);
          border: 1px solid var(--gold);
          color: var(--gold);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dd-tourist-name-wrapper {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .dd-tourist-name {
          font-family: 'Fraunces', serif;
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--paper);
          margin: 0;
        }

        .dd-msg-btn {
          position: relative;
          background: rgba(217, 164, 65, 0.15);
          border: 1px solid var(--gold);
          color: var(--gold);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 0;
        }
        .dd-msg-btn:hover {
          background: var(--gold);
          color: var(--ink);
          transform: scale(1.08);
        }

        .dd-notif-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          background: var(--coral);
          border: 2px solid var(--panel);
          border-radius: 50%;
        }

        .dd-tourist-email {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          color: var(--sage);
        }

        .dd-booking-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          color: var(--gold);
          background: rgba(217,164,65,0.1);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          margin-left: 0.4rem;
        }

        .dd-badge {
          padding: 0.35rem 0.85rem;
          border-radius: 999px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          border: 1px solid transparent;
        }

        .dd-ticket-body {
          padding: 1.4rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .dd-route {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background: rgba(15, 46, 43, 0.55);
          border: 1px solid var(--panel-edge);
          padding: 0.9rem 1.2rem;
          border-radius: 12px;
        }
        .dd-route-point { flex: 1; }
        .dd-route-label {
          display: block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--sage);
          margin-bottom: 0.2rem;
        }
        .dd-route-val {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--paper);
          word-break: break-word;
        }
        .dd-route-arrow {
          color: var(--gold);
          opacity: 0.8;
          display: flex;
          align-items: center;
        }

        .dd-meta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
        }
        .dd-meta-item { display: flex; align-items: center; gap: 0.6rem; }
        .dd-meta-icon { color: var(--gold); display: flex; align-items: center; }
        .dd-meta-label {
          display: block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--sage);
        }
        .dd-meta-val { font-size: 0.9rem; font-weight: 500; color: var(--paper); }

        .dd-actions {
          display: flex;
          gap: 0.8rem;
          margin-top: 0.4rem;
          padding-top: 1rem;
          border-top: 1px dashed var(--panel-edge);
        }
        .dd-btn-accept {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: var(--green);
          color: #E8F7EE;
          border: 1px solid #3F8A60;
          padding: 0.75rem 1rem;
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
          transition: filter 0.15s, transform 0.12s;
        }
        .dd-btn-accept:hover { filter: brightness(1.15); transform: translateY(-1px); }

        .dd-btn-reject {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: rgba(224, 103, 43, 0.18);
          color: #F89D7A;
          border: 1px solid var(--coral);
          padding: 0.75rem 1rem;
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
          transition: background 0.15s, color 0.15s, transform 0.12s;
        }
        .dd-btn-reject:hover { background: var(--coral); color: var(--paper); transform: translateY(-1px); }

        .dd-status-marked {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.78rem;
          color: var(--sage);
          text-align: right;
          margin: 0;
          padding-top: 0.5rem;
          border-top: 1px dashed var(--panel-edge);
        }

        /* CHAT MODAL STYLES */
        .chat-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 46, 43, 0.85);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .chat-modal {
          background: var(--panel);
          border: 1px solid var(--panel-edge);
          border-radius: 20px;
          width: 100%;
          max-width: 540px;
          height: 600px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6);
        }

        .chat-header {
          padding: 1.2rem 1.5rem;
          background: #0F2E2B;
          border-bottom: 1px solid var(--panel-edge);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-tourist-title {
          font-family: 'Fraunces', serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--paper);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .chat-trip-badge {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          background: rgba(217, 164, 65, 0.2);
          border: 1px solid var(--gold);
          color: var(--gold);
          padding: 0.15rem 0.5rem;
          border-radius: 6px;
        }

        .chat-route-sub {
          font-size: 0.82rem;
          color: var(--sage);
          margin-top: 0.3rem;
        }

        .chat-close-btn {
          background: transparent;
          border: none;
          color: var(--sage);
          cursor: pointer;
          padding: 0.3rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .chat-close-btn:hover { background: rgba(255,255,255,0.1); color: var(--paper); }

        .chat-body {
          flex: 1;
          padding: 1.2rem 1.5rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: rgba(15, 46, 43, 0.3);
        }

        .chat-bubble {
          max-width: 82%;
          padding: 0.8rem 1.1rem;
          border-radius: 14px;
          font-size: 0.92rem;
          line-height: 1.45;
          position: relative;
        }

        .chat-bubble.tourist {
          align-self: flex-start;
          background: rgba(35, 78, 72, 0.85);
          color: var(--paper);
          border-bottom-left-radius: 2px;
          border: 1px solid var(--panel-edge);
        }

        .chat-bubble.driver {
          align-self: flex-end;
          background: var(--gold);
          color: #0F2E2B;
          border-bottom-right-radius: 2px;
          font-weight: 500;
        }

        .chat-time {
          display: block;
          font-size: 0.65rem;
          margin-top: 0.3rem;
          opacity: 0.75;
          text-align: right;
        }

        .chat-footer {
          padding: 1rem 1.2rem;
          background: #0F2E2B;
          border-top: 1px solid var(--panel-edge);
          display: flex;
          gap: 0.8rem;
          align-items: center;
        }

        .chat-input {
          flex: 1;
          background: rgba(22, 60, 55, 0.8);
          border: 1px solid var(--panel-edge);
          border-radius: 25px;
          padding: 0.75rem 1.2rem;
          color: var(--paper);
          font-size: 0.92rem;
          outline: none;
        }
        .chat-input:focus { border-color: var(--gold); }

        .chat-send-btn {
          background: var(--gold);
          color: #0F2E2B;
          border: none;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .chat-send-btn:hover { transform: scale(1.05); }

        @media (max-width: 580px) {
          .dd-route { flex-direction: column; align-items: flex-start; gap: 0.6rem; }
          .dd-route-arrow { transform: rotate(90deg); align-self: center; }
          .dd-actions { flex-direction: column; }
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="dd-hero">
        <span className="dd-eyebrow">Chauffeur Control Panel</span>
        <h1 className="dd-title">Passenger <em>Ride</em> Requests</h1>
        <p className="dd-subtitle">Manage upcoming tourist transfers, confirm schedule details, and update ride status.</p>
        <svg className="dd-wave" viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path d="M0,20 C150,38 300,2 450,20 C600,38 750,2 900,20 C1050,38 1150,12 1200,20 L1200,40 L0,40 Z" fill="#0F2E2B" />
        </svg>
      </section>

      {/* MAIN CONTAINER */}
      <div className="dd-container">
        {error && <div className="dd-error-box">{error}</div>}

        {loading ? (
          <div className="dd-status-box">
            <p>Fetching ride requests from tourists...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="dd-status-box">
            <p style={{ fontSize: '1.1rem', color: 'var(--paper)', marginBottom: '0.5rem' }}>No Pending Ride Requests</p>
            <p style={{ fontSize: '0.88rem' }}>You currently have no ride requests assigned to your account.</p>
          </div>
        ) : (
          <div className="dd-card-list">
            {bookings.map((booking) => {
              const statusInfo = getStatusBadge(booking.status);
              const touristName = booking.tourist?.name || 'Pasindu User';
              const bookingShortId = booking._id ? `#${booking._id.slice(-6)}` : '';

              return (
                <div key={booking._id} className="dd-ticket">
                  <div className="dd-ticket-head">
                    <div className="dd-tourist-info">
                      <div className="dd-tourist-icon">
                        <TouristIcon />
                      </div>
                      <div>
                        <div className="dd-tourist-name-wrapper">
                          <h3 className="dd-tourist-name">{touristName}</h3>
                          <button 
                            className="dd-msg-btn"
                            title={`Chat about trip ${booking.pickupLocation} to ${booking.destination}`}
                            onClick={() => setActiveChatBooking(booking)}
                          >
                            <MessageIcon />
                            <span className="dd-notif-badge"></span>
                          </button>
                        </div>
                        <span className="dd-tourist-email">
                          {booking.tourist?.email || 'pasindu@gmail.com'}
                          <span className="dd-booking-tag">{bookingShortId}</span>
                        </span>
                      </div>
                    </div>

                    <span 
                      className="dd-badge"
                      style={{ background: statusInfo.bg, borderColor: statusInfo.border, color: statusInfo.color }}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="dd-ticket-body">
                    <div className="dd-route">
                      <div className="dd-route-point">
                        <span className="dd-route-label">Pickup Location</span>
                        <div className="dd-route-val">{booking.pickupLocation}</div>
                      </div>

                      <div className="dd-route-arrow"><ArrowRightIcon /></div>

                      <div className="dd-route-point">
                        <span className="dd-route-label">Destination</span>
                        <div className="dd-route-val">{booking.destination}</div>
                      </div>
                    </div>

                    <div className="dd-meta-grid">
                      <div className="dd-meta-item">
                        <div className="dd-meta-icon"><CalendarIcon /></div>
                        <div>
                          <span className="dd-meta-label">Requested Date</span>
                          <div className="dd-meta-val">{new Date(booking.date).toLocaleDateString()}</div>
                        </div>
                      </div>

                      {booking.totalPrice && (
                        <div className="dd-meta-item">
                          <div className="dd-meta-icon">💰</div>
                          <div>
                            <span className="dd-meta-label">Est. Fare</span>
                            <div className="dd-meta-val" style={{ fontFamily: 'IBM Plex Mono', color: 'var(--gold)' }}>
                              LKR {booking.totalPrice}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {booking.status === 'pending' ? (
                      <div className="dd-actions">
                        <button onClick={() => handleStatusChange(booking._id, 'accepted')} className="dd-btn-accept">
                          <CheckIcon /> Accept Request
                        </button>
                        <button onClick={() => handleStatusChange(booking._id, 'rejected')} className="dd-btn-reject">
                          <CrossIcon /> Reject Request
                        </button>
                      </div>
                    ) : (
                      <p className="dd-status-marked">
                        LOG: Request marked as <strong style={{ color: 'var(--paper)' }}>{booking.status.toUpperCase()}</strong>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CHAT MODAL INTERFACE */}
      {activeChatBooking && (
        <div className="chat-overlay" onClick={() => setActiveChatBooking(null)}>
          <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
            <div className="chat-header">
              <div>
                <h3 className="chat-tourist-title">
                  💬 {activeChatBooking.tourist?.name || 'Pasindu User'}
                  <span className="chat-trip-badge">Trip #{activeChatBooking._id?.slice(-6)}</span>
                </h3>
                <div className="chat-route-sub">
                  Route: <strong>{activeChatBooking.pickupLocation}</strong> ➔ <strong>{activeChatBooking.destination}</strong>
                </div>
              </div>
              <button className="chat-close-btn" onClick={() => setActiveChatBooking(null)}>
                <CloseIcon />
              </button>
            </div>

            {/* REAL-TIME DATABASE MESSAGES LIST */}
            <div className="chat-body">
              {messages.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--sage)', fontSize: '0.85rem' }}>No messages yet. Start the conversation!</p>
              ) : (
                messages.map((msg) => {
                  const senderType = typeof msg.sender === 'object' ? (msg.sender.role || 'driver') : msg.sender;
                  return (
                    <div key={msg._id || msg.createdAt} className={`chat-bubble ${senderType}`}>
                      <div>{msg.text}</div>
                      <span className="chat-time">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* MESSAGE INPUT FORM */}
            <form onSubmit={handleSendMessage} className="chat-footer">
              <input
                type="text"
                className="chat-input"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="chat-send-btn">
                <SendIcon />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;