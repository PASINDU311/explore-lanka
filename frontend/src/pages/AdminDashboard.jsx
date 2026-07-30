import React, { useState, useEffect } from 'react';
import API from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('drivers'); // 'drivers' | 'places' | 'bookings'
  
  // Data States
  const [drivers, setDrivers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Destination Form State
  const [placeForm, setPlaceForm] = useState({
    title: '',
    description: '',
    district: '',
    category: 'Culture',
    entryFee: 0,
    imageUrl: ''
  });

  // Fetch All Admin Data
  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Drivers
      const driversRes = await API.get('/admin/drivers').catch(() => ({ data: [] }));
      setDrivers(driversRes.data);

      // 2. Fetch Places (🟢 FIX: /destinations වෙනුවට /places ලෙස වෙනස් කරන ලදී)
      const placesRes = await API.get('/places').catch(() => ({ data: [] }));
      setPlaces(placesRes.data);

      // 3. Fetch All Bookings
      const bookingsRes = await API.get('/bookings/all').catch(() => ({ data: [] }));
      setBookings(bookingsRes.data);

    } catch (err) {
      console.error('Error loading admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // --- DRIVER HANDLERS ---
  const handleDriverStatus = async (id, status) => {
    try {
      await API.patch(`/admin/drivers/${id}/status`, { status });
      alert(`Driver status updated to ${status.toUpperCase()}`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to update driver status');
    }
  };

  const handleDeleteDriver = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently remove driver "${name}"?`)) {
      try {
        await API.delete(`/admin/drivers/${id}`);
        alert('Driver removed from system');
        fetchAdminData();
      } catch (err) {
        alert('Failed to delete driver');
      }
    }
  };

  // --- DESTINATION HANDLERS ---
  const handlePlaceSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/destinations', placeForm);
      alert('New Destination Added Successfully!');
      setPlaceForm({ title: '', description: '', district: '', category: 'Culture', entryFee: 0, imageUrl: '' });
      fetchAdminData();
    } catch (err) {
      alert('Failed to add destination');
    }
  };

  const handleDeletePlace = async (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        await API.delete(`/destinations/${id}`);
        alert('Destination deleted');
        fetchAdminData();
      } catch (err) {
        alert('Failed to delete destination');
      }
    }
  };

  // 🟢 FIX: approvalStatus එකක් නැති අය සහ 'pending' අය දෙගොල්ලන්ම Pending Drivers ලැයිස්තුවට ගනියි
  const pendingDrivers = drivers.filter(d => !d.approvalStatus || d.approvalStatus === 'pending');
  const approvedDrivers = drivers.filter(d => d.approvalStatus === 'approved');

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <div style={{ background: '#0f172a', color: '#fff', padding: '2rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, color: '#38bdf8' }}>⚙️ Admin Control Panel</h1>
        <p style={{ margin: '0.4rem 0 0 0', color: '#94a3b8' }}>Manage Drivers, Destinations, and Passenger Bookings</p>

        {/* Tab Navigation Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button 
            onClick={() => setActiveTab('drivers')} 
            style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', background: activeTab === 'drivers' ? '#38bdf8' : '#1e293b', color: activeTab === 'drivers' ? '#0f172a' : '#fff' }}
          >
            🛺 Drivers Management ({pendingDrivers.length > 0 ? `⚠️ ${pendingDrivers.length} Pending` : drivers.length})
          </button>
          
          <button 
            onClick={() => setActiveTab('places')} 
            style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', background: activeTab === 'places' ? '#38bdf8' : '#1e293b', color: activeTab === 'places' ? '#0f172a' : '#fff' }}
          >
            📍 Destinations ({places.length})
          </button>

          <button 
            onClick={() => setActiveTab('bookings')} 
            style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', background: activeTab === 'bookings' ? '#38bdf8' : '#1e293b', color: activeTab === 'bookings' ? '#0f172a' : '#fff' }}
          >
            📅 All Bookings ({bookings.length})
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', margin: '3rem' }}>🔄 Loading Admin Data...</p>
      ) : (
        <>
          {/* ================= TAB 1: DRIVERS MANAGEMENT ================= */}
          {activeTab === 'drivers' && (
            <div>
              {/* 1. Pending Approvals */}
              <section style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', color: '#b45309' }}>
                  ⏳ Pending Driver Applications ({pendingDrivers.length})
                </h3>

                {pendingDrivers.length === 0 ? (
                  <p style={{ color: '#64748b' }}>No pending driver registration requests.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    {pendingDrivers.map((d) => (
                      <div key={d._id} style={{ padding: '1.2rem', border: '1px solid #fde047', borderRadius: '8px', background: '#fefce8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ margin: 0, color: '#0f172a' }}>👨‍✈️ {d.name} ({d.email})</h4>
                          <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.9rem', color: '#475569' }}>
                            🚘 <strong>Vehicle:</strong> {d.driverDetails?.vehicleType || 'N/A'} ({d.driverDetails?.vehicleNumber || 'N/A'}) | 💰 <strong>Rate:</strong> LKR {d.driverDetails?.pricePerKm || 0}/km
                          </p>
                          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                            📄 <strong>License:</strong> {d.driverDetails?.licenseNumber || 'Not Provided'}
                          </p>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleDriverStatus(d._id, 'approved')} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>✓ Approve</button>
                          <button onClick={() => handleDriverStatus(d._id, 'rejected')} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>✕ Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* 2. Registered Approved Drivers */}
              <section>
                <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', color: '#15803d' }}>
                  🛺 Approved Registered Drivers ({approvedDrivers.length})
                </h3>

                {approvedDrivers.length === 0 ? (
                  <p style={{ color: '#64748b' }}>No approved drivers in the system yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    {approvedDrivers.map((d) => (
                      <div key={d._id} style={{ padding: '1.2rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ margin: 0, color: '#0f172a' }}>👨‍✈️ {d.name} <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#15803d', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>ACTIVE</span></h4>
                          <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.9rem', color: '#475569' }}>
                            ✉️ {d.email} | 🚘 {d.driverDetails?.vehicleType || 'Taxi'} | 💳 LKR {d.driverDetails?.pricePerKm || 0}/km
                          </p>
                        </div>

                        <button onClick={() => handleDeleteDriver(d._id, d.name)} style={{ background: '#991b1b', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>🗑️ Remove Driver</button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* ================= TAB 2: DESTINATIONS MANAGEMENT ================= */}
          {activeTab === 'places' && (
            <div>
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '2rem' }}>
                <h3>➕ Add New Destination / Place</h3>
                <form onSubmit={handlePlaceSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                  <input type="text" placeholder="Place Title (e.g., Sigiriya Fortress)" value={placeForm.title} onChange={(e) => setPlaceForm({ ...placeForm, title: e.target.value })} required style={{ padding: '0.6rem', borderRadius: '5px', border: '1px solid #cbd5e1' }} />
                  <input type="text" placeholder="District (e.g., Matale)" value={placeForm.district} onChange={(e) => setPlaceForm({ ...placeForm, district: e.target.value })} required style={{ padding: '0.6rem', borderRadius: '5px', border: '1px solid #cbd5e1' }} />
                  
                  <select value={placeForm.category} onChange={(e) => setPlaceForm({ ...placeForm, category: e.target.value })} style={{ padding: '0.6rem', borderRadius: '5px', border: '1px solid #cbd5e1' }}>
                    <option value="Culture">Culture</option>
                    <option value="Beach">Beach</option>
                    <option value="Hiking">Hiking</option>
                    <option value="Wildlife">Wildlife</option>
                    <option value="Food">Food</option>
                  </select>

                  <input type="number" placeholder="Entry Fee ($)" value={placeForm.entryFee} onChange={(e) => setPlaceForm({ ...placeForm, entryFee: e.target.value })} style={{ padding: '0.6rem', borderRadius: '5px', border: '1px solid #cbd5e1' }} />
                  <input type="text" placeholder="Image URL" value={placeForm.imageUrl} onChange={(e) => setPlaceForm({ ...placeForm, imageUrl: e.target.value })} style={{ gridColumn: 'span 2', padding: '0.6rem', borderRadius: '5px', border: '1px solid #cbd5e1' }} />
                  <textarea placeholder="Description" value={placeForm.description} onChange={(e) => setPlaceForm({ ...placeForm, description: e.target.value })} required style={{ gridColumn: 'span 2', padding: '0.6rem', borderRadius: '5px', border: '1px solid #cbd5e1', height: '80px' }} />

                  <button type="submit" style={{ gridColumn: 'span 2', background: '#0284c7', color: '#fff', padding: '0.8rem', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>➕ Add Destination</button>
                </form>
              </div>

              <h3>📍 Current Destinations ({places.length})</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                {places.map((p) => (
                  <div key={p._id} style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
                    {p.imageUrl && <img src={p.imageUrl} alt={p.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />}
                    <div style={{ padding: '1rem' }}>
                      <h4 style={{ margin: 0 }}>{p.title}</h4>
                      <p style={{ margin: '0.3rem 0', fontSize: '0.85rem', color: '#64748b' }}>📍 {p.district} | 🏷️ {p.category}</p>
                      <button onClick={() => handleDeletePlace(p._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', width: '100%', marginTop: '0.5rem', cursor: 'pointer' }}>Delete Place</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 3: ALL BOOKINGS ================= */}
          {activeTab === 'bookings' && (
            <div>
              <h3>📅 System Wide Bookings ({bookings.length})</h3>
              {bookings.length === 0 ? (
                <p style={{ color: '#64748b' }}>No bookings placed in the system yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  {bookings.map((b) => (
                    <div key={b._id} style={{ padding: '1.2rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: 0, color: '#0f172a' }}>👤 Tourist: {b.tourist?.name} ➡️ 👨‍✈️ Driver: {b.driver?.name}</h4>
                        <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.9rem', color: '#475569' }}>📍 Pickup: {b.pickupLocation} | 📅 Date: {new Date(b.travelDate).toLocaleDateString()}</p>
                      </div>
                      <span style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem', background: b.status === 'confirmed' ? '#dcfce7' : b.status === 'rejected' ? '#fee2e2' : '#fef3c7', color: b.status === 'confirmed' ? '#15803d' : b.status === 'rejected' ? '#b91c1c' : '#b45309' }}>
                        {b.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default AdminDashboard;