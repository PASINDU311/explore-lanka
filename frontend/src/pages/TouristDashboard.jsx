import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const TouristDashboard = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTouristBookings = async () => {
      try {
        setLoading(true);
        const res = await API.get('/bookings/my-bookings');
        setBookings(res.data);
      } catch (err) {
        console.error('Error loading tourist bookings', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTouristBookings();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      
      {/* Tourist Welcome Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0284c7, #0f172a)', color: '#fff', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Welcome Back, {user.name} 👋</h1>
        <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>Plan your dream Sri Lankan holiday & track your driver bookings here.</p>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.2rem' }}>
          <Link to="/planner" style={{ background: '#fff', color: '#0284c7', padding: '0.6rem 1.2rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>🤖 Generate AI Itinerary</Link>
          <Link to="/drivers" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>🛺 Find Drivers</Link>
        </div>
      </div>

      <h3>🧭 My Requested Driver Bookings</h3>

      {loading ? (
        <p>Loading your trip requests...</p>
      ) : bookings.length === 0 ? (
        <div style={{ padding: '2.5rem', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <p style={{ color: '#64748b', margin: '0 0 1rem 0' }}>You haven't requested any drivers for your trips yet.</p>
          <Link to="/drivers" style={{ background: '#0284c7', color: '#fff', padding: '0.5rem 1rem', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}>Browse Available Drivers</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {bookings.map((b) => (
            <div key={b._id} style={{ padding: '1.2rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div>
                <h4 style={{ margin: 0, color: '#0f172a' }}>👨‍✈️ Driver: {b.driver?.name || 'Assigned Driver'}</h4>
                <p style={{ margin: '0.4rem 0 0.2rem 0', color: '#334155' }}>📍 <strong>Pickup Location:</strong> {b.pickupLocation}</p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>📅 <strong>Date:</strong> {new Date(b.travelDate).toLocaleDateString()}</p>
                {b.note && <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Note: "{b.note}"</p>}
              </div>

              <div>
                <span style={{ 
                  padding: '0.4rem 0.9rem', 
                  borderRadius: '20px', 
                  fontWeight: 'bold', 
                  fontSize: '0.85rem', 
                  background: b.status === 'confirmed' ? '#dcfce7' : b.status === 'rejected' ? '#fee2e2' : '#fef3c7', 
                  color: b.status === 'confirmed' ? '#15803d' : b.status === 'rejected' ? '#b91c1c' : '#b45309' 
                }}>
                  {b.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default TouristDashboard;