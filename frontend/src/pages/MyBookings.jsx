import React, { useEffect, useState, useRef } from 'react';
import API from '../services/api';

const DriverHatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
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

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🟢 CHAT STATES
  const [activeChatBooking, setActiveChatBooking] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  useEffect(() => {
    // Auto-scroll chat to bottom when messages update
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Active Chat එක විවෘත වූ විට Backend එකෙන් Messages ගෙන ඒම සහ තත්පර 3කට වරක් Sync (Polling) කිරීම
  useEffect(() => {
    let interval;
    if (activeChatBooking) {
      fetchMessages(activeChatBooking._id);

      interval = setInterval(() => {
        fetchMessages(activeChatBooking._id);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [activeChatBooking]);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get('/bookings/my-bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load your reservations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // 🟢 BACKEND එකෙන් MESSAGES GET කිරීම
  const fetchMessages = async (bookingId) => {
    try {
      const res = await API.get(`/bookings/${bookingId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching chat messages:', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
      case 'approved':
      case 'confirmed':
        return { 
          label: 'CONFIRMED', 
          bg: 'rgba(47, 107, 73, 0.35)', 
          border: '#2F6B49', 
          color: '#72DDA2' 
        };
      case 'rejected':
        return { 
          label: 'REJECTED', 
          bg: 'rgba(224, 103, 43, 0.25)', 
          border: '#E0672B', 
          color: '#F89D7A' 
        };
      default:
        return { 
          label: 'PENDING', 
          bg: 'rgba(217, 164, 65, 0.25)', 
          border: '#D9A441', 
          color: '#F2C975' 
        };
    }
  };

  // 🟢 CHAT MODAL OPEN FUNCTION
  const handleOpenChat = (booking) => {
    setActiveChatBooking(booking);
    setMessages([]); // Clear previous active messages until fetch completes
  };

  // 🟢 BACKEND එකට MESSAGE SEND කිරීම (sender: 'tourist')
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatBooking) return;

    try {
      const res = await API.post(`/bookings/${activeChatBooking._id}/messages`, {
        sender: 'tourist',
        text: newMessage
      });

      setMessages((prev) => [...prev, res.data]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="mb-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

        .mb-page {
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

        .mb-hero {
          position: relative;
          padding: 4rem 1.5rem 5.5rem;
          text-align: center;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 15% -10%, rgba(217,164,65,0.16), transparent 55%),
            radial-gradient(ellipse at 88% 5%, rgba(47,164,160,0.16), transparent 50%),
            var(--ink);
        }
        .mb-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--gold);
        }
        .mb-eyebrow::before, .mb-eyebrow::after {
          content: '';
          width: 22px;
          height: 1px;
          background: var(--gold);
          opacity: 0.6;
        }
        .mb-title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: clamp(2.1rem, 5vw, 3.2rem);
          line-height: 1.08;
          margin: 1rem 0 0.9rem;
        }
        .mb-title em { font-style: italic; font-weight: 500; color: var(--gold); }
        .mb-subtitle {
          max-width: 480px;
          margin: 0 auto;
          color: var(--sage);
          font-size: 1rem;
          line-height: 1.55;
        }
        .mb-wave {
          position: absolute;
          left: 0; right: 0; bottom: -1px;
          width: 100%;
          height: 40px;
          display: block;
        }

        .mb-container {
          max-width: 820px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .mb-status-box {
          text-align: center;
          padding: 3rem 1.5rem;
          background: var(--panel);
          border: 1px dashed var(--panel-edge);
          border-radius: 16px;
          color: var(--sage);
        }
        .mb-error-box {
          background: rgba(224, 103, 43, 0.15);
          border: 1px solid var(--coral);
          color: #F89D7A;
          padding: 1rem 1.2rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          font-size: 0.92rem;
          text-align: center;
        }

        .mb-card-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .mb-ticket {
          background: var(--panel);
          border: 1px solid var(--panel-edge);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 16px 32px -12px rgba(0,0,0,0.4);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .mb-ticket:hover {
          transform: translateY(-2px);
          border-color: rgba(217, 164, 65, 0.4);
        }

        .mb-ticket-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.2rem 1.5rem;
          background: rgba(15, 46, 43, 0.45);
          border-bottom: 1.5px dashed var(--panel-edge);
        }
        .mb-driver-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .mb-driver-icon {
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
        .mb-driver-name-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .mb-driver-title {
          font-family: 'Fraunces', serif;
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--paper);
          margin: 0;
        }

        .mb-msg-btn {
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
        .mb-msg-btn:hover {
          background: var(--gold);
          color: var(--ink);
          transform: scale(1.08);
        }

        .mb-driver-sub {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          color: var(--sage);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: block;
        }

        .mb-badge {
          padding: 0.35rem 0.85rem;
          border-radius: 999px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          border: 1px solid transparent;
        }

        .mb-ticket-body {
          padding: 1.4rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .mb-route {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background: rgba(15, 46, 43, 0.55);
          border: 1px solid var(--panel-edge);
          padding: 0.9rem 1.2rem;
          border-radius: 12px;
        }
        .mb-route-point { flex: 1; }
        .mb-route-label {
          display: block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--sage);
          margin-bottom: 0.2rem;
        }
        .mb-route-val {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--paper);
          word-break: break-word;
        }
        .mb-route-arrow {
          color: var(--gold);
          opacity: 0.8;
          display: flex;
          align-items: center;
        }

        .mb-meta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          padding-top: 0.4rem;
        }
        .mb-meta-item { display: flex; align-items: center; gap: 0.6rem; }
        .mb-meta-icon { color: var(--gold); display: flex; align-items: center; }
        .mb-meta-label {
          display: block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--sage);
        }
        .mb-meta-val { font-size: 0.9rem; font-weight: 500; color: var(--paper); }

        /* 🟢 CHAT MODAL STYLES */
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
          max-width: 520px;
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

        .chat-driver-title {
          font-family: 'Fraunces', serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--paper);
          margin: 0;
        }

        .chat-route-sub {
          font-size: 0.78rem;
          color: var(--sage);
          margin-top: 0.2rem;
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
        .chat-close-btn:hover {
          background: rgba(255,255,255,0.1);
          color: var(--paper);
        }

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
          max-width: 80%;
          padding: 0.8rem 1.1rem;
          border-radius: 14px;
          font-size: 0.92rem;
          line-height: 1.45;
          position: relative;
        }

        .chat-bubble.driver {
          align-self: flex-start;
          background: rgba(35, 78, 72, 0.8);
          color: var(--paper);
          border-bottom-left-radius: 2px;
          border: 1px solid var(--panel-edge);
        }

        .chat-bubble.tourist, .chat-bubble.user {
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
        .chat-input:focus {
          border-color: var(--gold);
        }

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
        .chat-send-btn:hover {
          transform: scale(1.05);
        }

        @media (max-width: 580px) {
          .mb-route {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.6rem;
          }
          .mb-route-arrow {
            transform: rotate(90deg);
            align-self: center;
          }
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="mb-hero">
        <span className="mb-eyebrow">Your Journey Log</span>
        <h1 className="mb-title">My <em>Chauffeur</em> Bookings</h1>
        <p className="mb-subtitle">
          Review status, trip schedules, and itinerary details for all your private transport requests.
        </p>
        <svg className="mb-wave" viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path d="M0,20 C150,38 300,2 450,20 C600,38 750,2 900,20 C1050,38 1150,12 1200,20 L1200,40 L0,40 Z" fill="#0F2E2B" />
        </svg>
      </section>

      {/* MAIN CONTENT */}
      <div className="mb-container">
        {error && <div className="mb-error-box">{error}</div>}

        {loading ? (
          <div className="mb-status-box">
            <p>Retrieving your Ceylon reservations...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="mb-status-box">
            <p style={{ fontSize: '1.1rem', color: 'var(--paper)', marginBottom: '0.5rem' }}>No Driver Bookings Yet</p>
            <p style={{ fontSize: '0.88rem' }}>You haven't requested any drivers. Explore available drivers to book your journey!</p>
          </div>
        ) : (
          <div className="mb-card-list">
            {bookings.map((booking) => {
              const statusInfo = getStatusBadge(booking.status);
              const driverName = booking.driver?.name || 'Assigned Driver';

              return (
                <div key={booking._id} className="mb-ticket">
                  {/* TICKET HEADER */}
                  <div className="mb-ticket-head">
                    <div className="mb-driver-info">
                      <div className="mb-driver-icon">
                        <DriverHatIcon />
                      </div>
                      <div>
                        <div className="mb-driver-name-wrapper">
                          <h3 className="mb-driver-title">{driverName}</h3>
                          <button 
                            className="mb-msg-btn"
                            title={`Chat with ${driverName}`}
                            onClick={() => handleOpenChat(booking)}
                          >
                            <MessageIcon />
                          </button>
                        </div>
                        <span className="mb-driver-sub">Private Chauffeur</span>
                      </div>
                    </div>

                    <span 
                      className="mb-badge"
                      style={{ 
                        background: statusInfo.bg, 
                        borderColor: statusInfo.border, 
                        color: statusInfo.color 
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* TICKET BODY */}
                  <div className="mb-ticket-body">
                    <div className="mb-route">
                      <div className="mb-route-point">
                        <span className="mb-route-label">Pickup Location</span>
                        <div className="mb-route-val">{booking.pickupLocation}</div>
                      </div>

                      <div className="mb-route-arrow">
                        <ArrowRightIcon />
                      </div>

                      <div className="mb-route-point">
                        <span className="mb-route-label">Destination</span>
                        <div className="mb-route-val">{booking.destination}</div>
                      </div>
                    </div>

                    <div className="mb-meta-grid">
                      <div className="mb-meta-item">
                        <div className="mb-meta-icon"><CalendarIcon /></div>
                        <div>
                          <span className="mb-meta-label">Scheduled Date</span>
                          <div className="mb-meta-val">{new Date(booking.date).toLocaleDateString()}</div>
                        </div>
                      </div>

                      {booking.totalPrice && (
                        <div className="mb-meta-item">
                          <div className="mb-meta-icon">💰</div>
                          <div>
                            <span className="mb-meta-label">Est. Cost</span>
                            <div className="mb-meta-val" style={{ fontFamily: 'IBM Plex Mono', color: 'var(--gold)' }}>
                              LKR {booking.totalPrice}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🟢 CHAT MODAL INTERFACE */}
      {activeChatBooking && (
        <div className="chat-overlay" onClick={() => setActiveChatBooking(null)}>
          <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="chat-header">
              <div>
                <h3 className="chat-driver-title">
                  💬 {activeChatBooking.driver?.name || 'Driver'}
                </h3>
                <div className="chat-route-sub">
                  Trip: <strong>{activeChatBooking.pickupLocation}</strong> ➔ <strong>{activeChatBooking.destination}</strong>
                </div>
              </div>
              <button 
                className="chat-close-btn" 
                onClick={() => setActiveChatBooking(null)}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Message Body */}
            <div className="chat-body">
              {messages.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--sage)', fontSize: '0.85rem' }}>
                  No messages yet. Send a message to start chatting!
                </p>
              ) : (
                messages.map((msg, index) => {
                  const senderType = typeof msg.sender === 'object' ? (msg.sender.role || 'tourist') : msg.sender;
                  return (
                    <div key={msg._id || index} className={`chat-bubble ${senderType}`}>
                      <div>{msg.text}</div>
                      <span className="chat-time">
                        {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form Footer */}
            <form onSubmit={handleSendMessage} className="chat-footer">
              <input
                type="text"
                className="chat-input"
                placeholder="Write a message to driver..."
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

export default MyBookings;