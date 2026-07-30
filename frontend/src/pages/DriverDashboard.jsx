import React, { useState, useEffect } from 'react';
import API from '../services/api';

const DriverDashboard = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDriverBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get('/bookings/my-bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Error loading driver bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverBookings();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.patch(`/bookings/${id}/status`, { status });
      alert(`Trip Request ${status.toUpperCase()}!`);
      fetchDriverBookings();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      
      {/* Driver Stats & Profile Header */}
      <div style={{ background: '#0f172a', color: '#fff', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, color: '#38bdf8', fontSize: '1.8rem' }}>👨‍✈️ Driver Portal: {user.name}</h1>
            <p style={{ margin: '0.4rem 0 0 0', color: '#94a3b8' }}>Vehicle: <strong>{user.driverDetails?.vehicleType || 'Taxi / TukTuk'}</strong> | License: <strong>{user.driverDetails?.licenseNumber || 'Verified'}</strong></p>
          </div>
          <div style={{ background: '#0284c7', padding: '0.6rem 1.2rem', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Rate per KM</span>
            <h3 style={{ margin: 0 }}>LKR {user.driverDetails?.pricePerKm || 0}</h3>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px', minWidth: '150px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Pending Requests</span>
            <h2 style={{ margin: '0.2rem 0 0 0', color: '#f59e0b' }}>{pendingCount}</h2>
          </div>
          <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px', minWidth: '150px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Confirmed Trips</span>
            <h2 style={{ margin: '0.2rem 0 0 0', color: '#10b981' }}>{confirmedCount}</h2>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <h3>🛺 Incoming Passenger Hire Requests</h3>
      
      {loading ? (
        <p>Loading hire requests...</p>
      ) : bookings.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <p style={{ color: '#64748b', margin: 0 }}>No hire requests received yet. Stay active!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {bookings.map((b) => (
            <div key={b._id} style={{ padding: '1.2rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div>
                <h4 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem' }}>👤 Tourist Name: {b.tourist?.name || 'Passenger'}</h4>
                <p style={{ margin: '0.4rem 0 0.2rem 0', color: '#334155' }}>📍 <strong>Pickup Location:</strong> {b.pickupLocation}</p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>📅 <strong>Travel Date:</strong> {new Date(b.travelDate).toLocaleDateString()} | ✉️ Contact Email: {b.tourist?.email}</p>
                {b.note && <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: '#0284c7', background: '#f0f9ff', padding: '0.4rem', borderRadius: '4px' }}>Note: "{b.note}"</p>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.6rem' }}>
                <span style={{ 
                  padding: '0.3rem 0.8rem', 
                  borderRadius: '20px', 
                  fontWeight: 'bold', 
                  fontSize: '0.85rem', 
                  background: b.status === 'confirmed' ? '#dcfce7' : b.status === 'rejected' ? '#fee2e2' : '#fef3c7', 
                  color: b.status === 'confirmed' ? '#15803d' : b.status === 'rejected' ? '#b91c1c' : '#b45309' 
                }}>
                  {b.status.toUpperCase()}
                </span>

                {b.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleStatusUpdate(b._id, 'confirmed')} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Accept Hire</button>
                    <button onClick={() => handleStatusUpdate(b._id, 'rejected')} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default DriverDashboard;