import React, { useEffect, useState } from 'react';
import API from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get('/bookings/my-bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  // Status අනුව Badge එකේ පාට සහ Text එක වෙනස් කිරීම
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
      case 'approved':
      case 'confirmed':
        return { label: 'CONFIRMED', bg: '#16a34a' }; // කොළ පාට
      case 'rejected':
        return { label: 'REJECTED', bg: '#dc2626' }; // රතු පාට
      default:
        return { label: 'PENDING', bg: '#d97706' }; // තැඹිලි පාට (Driver තාම Confirm කරලා නෑ)
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: '#fff' }}>Loading your bookings...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem', color: '#333' }}>
      <h2 style={{ color: '#0f172a', marginBottom: '1.5rem', textAlign: 'center' }}>📅 My Bookings</h2>

      {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.8rem', borderRadius: '6px', marginBottom: '1rem' }}>{error}</div>}

      {bookings.length === 0 ? (
        <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '8px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
          <p style={{ color: '#64748b', margin: 0 }}>You haven't booked any drivers yet!</p>
        </div>
      ) : (
        bookings.map((booking) => {
          const statusInfo = getStatusBadge(booking.status);
          return (
            <div key={booking._id} style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '1.2rem',
              marginBottom: '1rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: '#0284c7', fontSize: '1.1rem' }}>
                  🛺 Driver: {booking.driver?.name || 'Assigned Driver'}
                </h3>

                {/* 🟡 status badge (PENDING / CONFIRMED / REJECTED) */}
                <span style={{
                  padding: '0.35rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  color: '#fff',
                  background: statusInfo.bg
                }}>
                  {statusInfo.label}
                </span>
              </div>

              <hr style={{ border: 'none', borderBottom: '1px solid #f1f5f9', margin: '0.8rem 0' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.95rem' }}>
                <p style={{ margin: '0.2rem 0' }}>📍 <strong>Pickup:</strong> {booking.pickupLocation}</p>
                <p style={{ margin: '0.2rem 0' }}>🏁 <strong>Destination:</strong> {booking.destination}</p>
                <p style={{ margin: '0.2rem 0' }}>📅 <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                {booking.totalPrice && <p style={{ margin: '0.2rem 0' }}>💰 <strong>Price:</strong> LKR {booking.totalPrice}</p>}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyBookings;