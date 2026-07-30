import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [bookings, setBookings] = useState([]);
  
  // Admin state for adding places
  const [newPlace, setNewPlace] = useState({
    title: '', description: '', category: 'Culture', district: '', entryFeeUSD: 0, lng: 79.86, lat: 6.92
  });

  const fetchBookings = () => {
    API.get('/bookings/my-bookings')
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (user.role !== 'admin') {
      fetchBookings();
    }
  }, []);

  // Driver action: Accept or Reject
  const handleStatusUpdate = async (id, status) => {
    try {
      await API.patch(`/bookings/${id}/status`, { status });
      alert(`Booking ${status}!`);
      fetchBookings();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  // Admin action: Add Place
  const handleAddPlace = async (e) => {
    e.preventDefault();
    try {
      await API.post('/places', {
        title: newPlace.title,
        description: newPlace.description,
        category: newPlace.category,
        district: newPlace.district,
        entryFeeUSD: Number(newPlace.entryFeeUSD),
        coordinates: [Number(newPlace.lng), Number(newPlace.lat)]
      });
      alert('New Place Added Successfully to Database!');
      setNewPlace({ title: '', description: '', category: 'Culture', district: '', entryFeeUSD: 0, lng: 79.86, lat: 6.92 });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add place');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem' }}>
      <h2>Welcome, {user.name} 👋 ({user.role?.toUpperCase()})</h2>
      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1rem 0' }} />

      {/* --- DRIVER / TOURIST VIEW: BOOKINGS --- */}
      {user.role !== 'admin' && (
        <div>
          <h3>{user.role === 'driver' ? 'Incoming Booking Requests' : 'My Driver Bookings'}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {bookings.length === 0 ? <p>No bookings found.</p> : bookings.map((b) => (
              <div key={b._id} style={{ padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0 }}><strong>Pickup:</strong> {b.pickupLocation}</p>
                  <p style={{ margin: '0.2rem 0' }}><strong>Date:</strong> {new Date(b.travelDate).toLocaleDateString()}</p>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                    {user.role === 'driver' ? `Tourist: ${b.tourist?.name}` : `Driver: ${b.driver?.name}`}
                  </p>
                </div>

                <div>
                  <span style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem', background: b.status === 'confirmed' ? '#dcfce7' : b.status === 'rejected' ? '#fee2e2' : '#fef3c7', color: b.status === 'confirmed' ? '#15803d' : b.status === 'rejected' ? '#b91c1c' : '#b45309' }}>
                    {b.status.toUpperCase()}
                  </span>

                  {/* Driver buttons to Accept/Reject */}
                  {user.role === 'driver' && b.status === 'pending' && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleStatusUpdate(b._id, 'confirmed')} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}>Accept</button>
                      <button onClick={() => handleStatusUpdate(b._id, 'rejected')} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}>Reject</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- ADMIN VIEW: ADD NEW PLACE --- */}
      {user.role === 'admin' && (
        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <h3>➕ Add New Tourist Place (Admin Dashboard)</h3>
          <form onSubmit={handleAddPlace} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <input type="text" placeholder="Place Title" value={newPlace.title} onChange={(e) => setNewPlace({...newPlace, title: e.target.value})} required />
            <input type="text" placeholder="District (e.g. Kandy)" value={newPlace.district} onChange={(e) => setNewPlace({...newPlace, district: e.target.value})} required />
            <select value={newPlace.category} onChange={(e) => setNewPlace({...newPlace, category: e.target.value})}>
              <option value="Culture">Culture</option>
              <option value="Beach">Beach</option>
              <option value="Hiking">Hiking</option>
              <option value="Wildlife">Wildlife</option>
            </select>
            <input type="number" placeholder="Entry Fee (USD)" value={newPlace.entryFeeUSD} onChange={(e) => setNewPlace({...newPlace, entryFeeUSD: e.target.value})} required />
            <input type="number" step="any" placeholder="Longitude (e.g. 80.63)" value={newPlace.lng} onChange={(e) => setNewPlace({...newPlace, lng: e.target.value})} required />
            <input type="number" step="any" placeholder="Latitude (e.g. 7.29)" value={newPlace.lat} onChange={(e) => setNewPlace({...newPlace, lat: e.target.value})} required />
            <textarea placeholder="Description" style={{ gridColumn: 'span 2' }} value={newPlace.description} onChange={(e) => setNewPlace({...newPlace, description: e.target.value})} required />

            <button type="submit" style={{ gridColumn: 'span 2', background: '#0284c7', color: '#fff', border: 'none', padding: '0.7rem', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              Add Destination to Database
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;