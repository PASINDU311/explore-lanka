import React, { useState, useEffect } from 'react';
import API from '../services/api';

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.adb-container {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', sans-serif;
  color: #0f172a;
}

/* Sidebar Styling */
.adb-sidebar {
  width: 260px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  padding: 1.5rem 1.2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: sticky;
  top: 0;
  height: 100vh;
}

.adb-logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}
.adb-logo .mark { font-size: 1.4rem; }
.adb-badge-admin {
  font-size: 0.65rem;
  background: #ecfdf5;
  color: #059669;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  font-weight: 600;
}

.adb-menu-section {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.adb-menu-title {
  font-size: 0.7rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.adb-nav-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.adb-nav-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.adb-nav-btn.active {
  background: #ecfdf5;
  color: #059669;
  font-weight: 600;
}

.adb-count-badge {
  font-size: 0.75rem;
  background: #e2e8f0;
  color: #475569;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
}
.adb-count-badge.warning {
  background: #fef3c7;
  color: #b45309;
}

.adb-sidebar-footer {
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.adb-system-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 0.8rem;
}

.adb-status-dot {
  width: 10px;
  height: 10px;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

/* Main Content Area */
.adb-main {
  flex: 1;
  padding: 2rem;
  max-width: 1300px;
}

.adb-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.adb-header h1 {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
}

.adb-header p {
  margin: 0.2rem 0 0 0;
  color: #64748b;
  font-size: 0.9rem;
}

.adb-header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.adb-date-pill {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.85rem;
  color: #475569;
  font-weight: 500;
}

.adb-btn-refresh {
  background: #0f172a;
  color: #ffffff;
  border: none;
  padding: 0.55rem 1.1rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.adb-btn-refresh:hover { opacity: 0.9; }

/* Stats Grid */
.adb-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.adb-stat-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.25rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.adb-stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
}
.adb-stat-icon.green { background: #ecfdf5; color: #059669; }
.adb-stat-icon.amber { background: #fffbeb; color: #b45309; }
.adb-stat-icon.blue { background: #f0f9ff; color: #0284c7; }
.adb-stat-icon.purple { background: #faf5ff; color: #7e22ce; }

.adb-stat-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}

.adb-stat-card h3 {
  margin: 0.2rem 0 0 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: #0f172a;
}

.adb-stat-card h3 small {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 400;
}

/* Card Boxes */
.adb-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  margin-bottom: 1.5rem;
}

.adb-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Custom Table Layout */
.adb-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.5rem;
}

.adb-table th {
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.adb-table td {
  padding: 1rem;
  background: #ffffff;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.88rem;
}

.adb-table tr td:first-child {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  border-left: 1px solid #f1f5f9;
}

.adb-table tr td:last-child {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-right: 1px solid #f1f5f9;
}

.adb-table tr:hover td {
  background: #f8fafc;
}

/* Status Badges */
.adb-badge {
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}
.adb-badge.success { background: #dcfce7; color: #15803d; }
.adb-badge.warning { background: #fef3c7; color: #b45309; }
.adb-badge.danger { background: #fee2e2; color: #b91c1c; }

/* Action Buttons */
.adb-btn-action {
  padding: 0.45rem 0.9rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.adb-btn-approve { background: #ecfdf5; color: #059669; }
.adb-btn-approve:hover { background: #10b981; color: #fff; }

.adb-btn-reject { background: #fef2f2; color: #dc2626; }
.adb-btn-reject:hover { background: #dc2626; color: #fff; }

.adb-btn-delete { background: #f8fafc; color: #ef4444; border: 1px solid #fee2e2; }
.adb-btn-delete:hover { background: #ef4444; color: #fff; }

/* Form Styles */
.adb-form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.adb-input, .adb-select, .adb-textarea {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-size: 0.88rem;
  color: #0f172a;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.adb-input:focus, .adb-select:focus, .adb-textarea:focus {
  border-color: #10b981;
  background: #ffffff;
}

.adb-btn-submit {
  grid-column: span 2;
  background: #10b981;
  color: #ffffff;
  padding: 0.8rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}
.adb-btn-submit:hover { background: #059669; }

/* Destination Grid Cards */
.adb-places-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.2rem;
}

.adb-place-card {
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  transition: transform 0.2s ease;
}
.adb-place-card:hover { transform: translateY(-2px); }

.adb-place-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  background: #e2e8f0;
}

.adb-place-body {
  padding: 1rem;
}

@media (max-width: 900px) {
  .adb-container { flex-direction: column; }
  .adb-sidebar { width: 100%; height: auto; position: relative; }
  .adb-form-grid { grid-template-columns: 1fr; }
  .adb-btn-submit { grid-column: span 1; }
}
`;

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

      const driversRes = await API.get('/admin/drivers').catch(() => ({ data: [] }));
      setDrivers(driversRes.data);

      const placesRes = await API.get('/places').catch(() => ({ data: [] }));
      setPlaces(placesRes.data);

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
      const payload = {
        name: placeForm.title, 
        description: placeForm.description,
        district: placeForm.district,
        category: placeForm.category,
        entryFee: Number(placeForm.entryFee),
        imageUrl: placeForm.imageUrl
      };

      await API.post('/places', payload);
      alert('New Destination Added Successfully!');
      setPlaceForm({ title: '', description: '', district: '', category: 'Culture', entryFee: 0, imageUrl: '' });
      fetchAdminData();
    } catch (err) {
      console.error('Error adding place:', err);
      alert(err.response?.data?.message || 'Failed to add destination');
    }
  };

  const handleDeletePlace = async (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        await API.delete(`/places/${id}`);
        alert('Destination deleted');
        fetchAdminData();
      } catch (err) {
        alert('Failed to delete destination');
      }
    }
  };

  const pendingDrivers = drivers.filter(d => !d.approvalStatus || d.approvalStatus === 'pending');
  const approvedDrivers = drivers.filter(d => d.approvalStatus === 'approved');

  return (
    <div className="adb-container">
      <style>{styles}</style>

      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="adb-sidebar">
        <div>
          <div className="adb-logo">
            <span className="mark">🌴</span> ExploreLanka
            <span className="adb-badge-admin">ADMIN</span>
          </div>

          <div className="adb-menu-section">
            <span className="adb-menu-title">NAVIGATION</span>
            
            <button 
              className={`adb-nav-btn ${activeTab === 'drivers' ? 'active' : ''}`}
              onClick={() => setActiveTab('drivers')}
            >
              <span>🛺 Drivers</span>
              <span className={`adb-count-badge ${pendingDrivers.length > 0 ? 'warning' : ''}`}>
                {pendingDrivers.length > 0 ? `${pendingDrivers.length} Pending` : drivers.length}
              </span>
            </button>

            <button 
              className={`adb-nav-btn ${activeTab === 'places' ? 'active' : ''}`}
              onClick={() => setActiveTab('places')}
            >
              <span>📍 Destinations</span>
              <span className="adb-count-badge">{places.length}</span>
            </button>

            <button 
              className={`adb-nav-btn ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <span>📅 All Bookings</span>
              <span className="adb-count-badge">{bookings.length}</span>
            </button>
          </div>
        </div>

        <div className="adb-sidebar-footer">
          <div className="adb-system-card">
            <span className="adb-status-dot"></span>
            <div>
              <strong style={{ display: 'block', color: '#0f172a' }}>System Status</strong>
              <span style={{ color: '#64748b', fontSize: '0.75rem' }}>All services online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="adb-main">
        {/* Header */}
        <header className="adb-header">
          <div>
            <h1>Control Panel Dashboard</h1>
            <p>Manage registered drivers, destinations, and tourist bookings.</p>
          </div>

          <div className="adb-header-right">
            <span className="adb-date-pill">
              📅 {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <button className="adb-btn-refresh" onClick={fetchAdminData}>
              🔄 Refresh
            </button>
          </div>
        </header>

        {/* Stats Grid Overview */}
        <div className="adb-stats-grid">
          <div className="adb-stat-card">
            <div className="adb-stat-icon green">🛺</div>
            <div>
              <span className="adb-stat-label">Registered Drivers</span>
              <h3>{drivers.length} <small>({approvedDrivers.length} Approved)</small></h3>
            </div>
          </div>

          <div className="adb-stat-card">
            <div className="adb-stat-icon amber">⏳</div>
            <div>
              <span className="adb-stat-label">Pending Approval</span>
              <h3>{pendingDrivers.length}</h3>
            </div>
          </div>

          <div className="adb-stat-card">
            <div className="adb-stat-icon blue">📍</div>
            <div>
              <span className="adb-stat-label">Destinations</span>
              <h3>{places.length}</h3>
            </div>
          </div>

          <div className="adb-stat-card">
            <div className="adb-stat-icon purple">📅</div>
            <div>
              <span className="adb-stat-label">Total Bookings</span>
              <h3>{bookings.length}</h3>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <p>🔄 Fetching latest admin data...</p>
          </div>
        ) : (
          <>
            {/* ================= TAB 1: DRIVERS MANAGEMENT ================= */}
            {activeTab === 'drivers' && (
              <div>
                {/* 1. Pending Approvals Card */}
                <div className="adb-card">
                  <div className="adb-card-title">
                    <span>⏳ Pending Driver Requests ({pendingDrivers.length})</span>
                  </div>

                  {pendingDrivers.length === 0 ? (
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>No pending driver applications right now.</p>
                  ) : (
                    <table className="adb-table">
                      <thead>
                        <tr>
                          <th>Driver Info</th>
                          <th>Vehicle & License</th>
                          <th>Rate / km</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingDrivers.map((d) => (
                          <tr key={d._id}>
                            <td>
                              <strong style={{ color: '#0f172a', display: 'block' }}>{d.name}</strong>
                              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{d.email}</span>
                            </td>
                            <td>
                              <span style={{ display: 'block' }}>🚘 {d.driverDetails?.vehicleType || 'N/A'} ({d.driverDetails?.vehicleNumber || 'N/A'})</span>
                              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>📄 Lic: {d.driverDetails?.licenseNumber || 'N/A'}</span>
                            </td>
                            <td><strong>LKR {d.driverDetails?.pricePerKm || 0}</strong></td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button className="adb-btn-action adb-btn-approve" onClick={() => handleDriverStatus(d._id, 'approved')}>✓ Approve</button>
                                <button className="adb-btn-action adb-btn-reject" onClick={() => handleDriverStatus(d._id, 'rejected')}>✕ Reject</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* 2. Registered Approved Drivers Card */}
                <div className="adb-card">
                  <div className="adb-card-title">
                    <span>🛺 Approved Drivers ({approvedDrivers.length})</span>
                  </div>

                  {approvedDrivers.length === 0 ? (
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>No approved drivers found in system.</p>
                  ) : (
                    <table className="adb-table">
                      <thead>
                        <tr>
                          <th>Driver</th>
                          <th>Contact</th>
                          <th>Vehicle</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {approvedDrivers.map((d) => (
                          <tr key={d._id}>
                            <td><strong>👨‍✈️ {d.name}</strong></td>
                            <td style={{ color: '#64748b' }}>{d.email}</td>
                            <td>🚘 {d.driverDetails?.vehicleType || 'Taxi'} (LKR {d.driverDetails?.pricePerKm || 0}/km)</td>
                            <td><span className="adb-badge success">ACTIVE</span></td>
                            <td style={{ textAlign: 'right' }}>
                              <button className="adb-btn-action adb-btn-delete" onClick={() => handleDeleteDriver(d._id, d.name)}>🗑️ Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* ================= TAB 2: DESTINATIONS MANAGEMENT ================= */}
            {activeTab === 'places' && (
              <div>
                {/* Form Card */}
                <div className="adb-card">
                  <div className="adb-card-title">
                    <span>➕ Add New Destination / Place</span>
                  </div>

                  <form onSubmit={handlePlaceSubmit} className="adb-form-grid">
                    <input 
                      type="text" 
                      placeholder="Place Name (e.g., Sigiriya Fortress)" 
                      className="adb-input"
                      value={placeForm.title} 
                      onChange={(e) => setPlaceForm({ ...placeForm, title: e.target.value })} 
                      required 
                    />
                    <input 
                      type="text" 
                      placeholder="District (e.g., Matale)" 
                      className="adb-input"
                      value={placeForm.district} 
                      onChange={(e) => setPlaceForm({ ...placeForm, district: e.target.value })} 
                      required 
                    />

                    <select 
                      className="adb-select" 
                      value={placeForm.category} 
                      onChange={(e) => setPlaceForm({ ...placeForm, category: e.target.value })}
                    >
                      <option value="Culture">Culture</option>
                      <option value="Beach">Beach</option>
                      <option value="Hiking">Hiking</option>
                      <option value="Wildlife">Wildlife</option>
                      <option value="Food">Food</option>
                    </select>

                    <input 
                      type="number" 
                      placeholder="Entry Fee ($)" 
                      className="adb-input"
                      value={placeForm.entryFee} 
                      onChange={(e) => setPlaceForm({ ...placeForm, entryFee: e.target.value })} 
                    />

                    <input 
                      type="text" 
                      placeholder="Image URL" 
                      className="adb-input" 
                      style={{ gridColumn: 'span 2' }}
                      value={placeForm.imageUrl} 
                      onChange={(e) => setPlaceForm({ ...placeForm, imageUrl: e.target.value })} 
                    />

                    <textarea 
                      placeholder="Description" 
                      className="adb-textarea" 
                      style={{ gridColumn: 'span 2', height: '80px' }}
                      value={placeForm.description} 
                      onChange={(e) => setPlaceForm({ ...placeForm, description: e.target.value })} 
                      required 
                    />

                    <button type="submit" className="adb-btn-submit">➕ Save Destination</button>
                  </form>
                </div>

                {/* Places Grid */}
                <div className="adb-card">
                  <div className="adb-card-title">
                    <span>📍 Active Destinations ({places.length})</span>
                  </div>

                  <div className="adb-places-grid">
                    {places.map((p) => (
                      <div key={p._id} className="adb-place-card">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name || p.title} className="adb-place-img" />
                        ) : (
                          <div className="adb-place-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No Image</div>
                        )}
                        <div className="adb-place-body">
                          <h4 style={{ margin: '0 0 0.4rem 0', color: '#0f172a' }}>{p.name || p.title}</h4>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>📍 {p.district} • 🏷️ {p.category}</p>
                          <button 
                            className="adb-btn-action adb-btn-delete" 
                            style={{ width: '100%', marginTop: '0.8rem' }}
                            onClick={() => handleDeletePlace(p._id)}
                          >
                            Delete Destination
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 3: ALL BOOKINGS ================= */}
            {activeTab === 'bookings' && (
              <div className="adb-card">
                <div className="adb-card-title">
                  <span>📅 System Wide Bookings ({bookings.length})</span>
                </div>

                {bookings.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>No bookings placed in system yet.</p>
                ) : (
                  <table className="adb-table">
                    <thead>
                      <tr>
                        <th>Tourist</th>
                        <th>Driver</th>
                        <th>Pickup & Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b._id}>
                          <td><strong>👤 {b.tourist?.name || 'Tourist'}</strong></td>
                          <td><strong>👨‍✈️ {b.driver?.name || 'Driver'}</strong></td>
                          <td>
                            <span style={{ display: 'block' }}>📍 {b.pickupLocation}</span>
                            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>📅 {new Date(b.date || b.travelDate).toLocaleDateString()}</span>
                          </td>
                          <td>
                            <span className={`adb-badge ${
                              b.status === 'confirmed' || b.status === 'accepted' ? 'success' :
                              b.status === 'rejected' ? 'danger' : 'warning'
                            }`}>
                              {(b.status || 'PENDING').toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;