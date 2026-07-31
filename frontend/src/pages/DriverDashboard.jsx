import React, { useEffect, useState } from 'react';
import API from '../services/api';

const DriverDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDriverBookings();
  }, []);

  // Driver ට ආපු Bookings ලබා ගැනීම
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

  // Status එක Update කිරීම (Accept / Reject)
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await API.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      alert(`Booking request ${newStatus === 'accepted' ? 'ACCEPTED ✅' : 'REJECTED ❌'} successfully!`);
      // Update වූ පසු List එක නැවත Refresh කිරීම
      fetchDriverBookings();
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.response?.data?.message || 'Failed to update booking status.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: '#fff' }}>Loading ride requests...</div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '1rem', color: '#333' }}>
      <h2 style={{ color: '#0f172a', marginBottom: '1.5rem', textAlign: 'center' }}>
        🛺 Driver Dashboard - Ride Requests
      </h2>

      {error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.8rem', borderRadius: '6px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '8px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
          <p style={{ color: '#64748b', margin: 0 }}>No booking requests received yet!</p>
        </div>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '1.2rem',
            marginBottom: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0284c7', fontSize: '1.1rem' }}>
                  👤 Tourist: {booking.tourist?.name || 'Tourist'}
                </h3>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  📧 {booking.tourist?.email}
                </span>
              </div>

              {/* Status Badge */}
              <span style={{
                padding: '0.35rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                color: '#fff',
                background: booking.status === 'accepted' ? '#16a34a' : booking.status === 'rejected' ? '#dc2626' : '#d97706'
              }}>
                {booking.status.toUpperCase()}
              </span>
            </div>

            <hr style={{ border: 'none', borderBottom: '1px solid #f1f5f9', margin: '0.8rem 0' }} />

            {/* Request Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.95rem', marginBottom: '1rem' }}>
              <p style={{ margin: '0.2rem 0' }}>📍 <strong>Pickup:</strong> {booking.pickupLocation}</p>
              <p style={{ margin: '0.2rem 0' }}>🏁 <strong>Destination:</strong> {booking.destination}</p>
              <p style={{ margin: '0.2rem 0' }}>📅 <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
              {booking.totalPrice && <p style={{ margin: '0.2rem 0' }}>💰 <strong>Price:</strong> LKR {booking.totalPrice}</p>}
            </div>

            {/* Accept / Reject Action Buttons */}
            {booking.status === 'pending' ? (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={() => handleStatusChange(booking._id, 'accepted')}
                  style={{
                    flex: 1,
                    background: '#16a34a',
                    color: '#fff',
                    border: 'none',
                    padding: '0.6rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                >
                  ✅ Accept Request
                </button>
                <button
                  onClick={() => handleStatusChange(booking._id, 'rejected')}
                  style={{
                    flex: 1,
                    background: '#dc2626',
                    color: '#fff',
                    border: 'none',
                    padding: '0.6rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                >
                  ❌ Reject Request
                </button>
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic', margin: 0, textAlign: 'right' }}>
                Status: Marked as {booking.status}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default DriverDashboard;