import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [bookingData, setBookingData] = useState({ 
    pickupLocation: '', 
    destination: '', 
    date: '', 
    note: '' 
  });

  useEffect(() => {
    API.get('/auth/drivers')
      .then((res) => setDrivers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/bookings', {
        driverId: selectedDriver._id,
        pickupLocation: bookingData.pickupLocation,
        destination: bookingData.destination, // Backend එකට Destination යැවීම
        date: bookingData.date,                // Backend එකට Date යැවීම
        note: bookingData.note
      });

      alert('Booking Request Sent to Driver Successfully! Check your My Bookings page for updates.');
      setSelectedDriver(null);
      setBookingData({ pickupLocation: '', destination: '', date: '', note: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send booking request');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem' }}>
      <h2>Available Local Drivers & Guides 🛺🚗</h2>
      <p style={{ color: '#64748b' }}>Book verified drivers for your Sri Lanka trip</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
        {drivers.map((driver) => (
          <div key={driver._id} style={{ border: '1px solid #cbd5e1', padding: '1.2rem', borderRadius: '8px', background: '#fff' }}>
            <h3>👨‍✈️ {driver.name}</h3>
            <p style={{ margin: '0.4rem 0' }}>Vehicle: <strong>{driver.driverDetails?.vehicleType || 'Vehicle'}</strong></p>
            <p style={{ margin: '0.4rem 0' }}>License: {driver.driverDetails?.licenseNumber || 'Verified'}</p>
            <p style={{ margin: '0.4rem 0', color: '#059669', fontWeight: 'bold' }}>
              Rate: LKR {driver.driverDetails?.pricePerKm || 0} / KM
            </p>
            
            <button 
              onClick={() => setSelectedDriver(driver)}
              style={{ width: '100%', marginTop: '1rem', background: '#0284c7', color: '#fff', border: 'none', padding: '0.6rem', borderRadius: '5px', cursor: 'pointer' }}
            >
              Book Driver
            </button>
          </div>
        ))}
      </div>

      {/* --- BOOKING MODAL FORM --- */}
      {selectedDriver && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '10px', width: '400px' }}>
            <h3>Book {selectedDriver.name}</h3>
            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              
              {/* Pickup Location */}
              <input 
                type="text" 
                placeholder="Pickup Location (e.g. CMB Airport)" 
                required 
                value={bookingData.pickupLocation}
                onChange={(e) => setBookingData({ ...bookingData, pickupLocation: e.target.value })} 
              />

              {/* 🟢 Destination input එක එකතු කරන ලදී */}
              <input 
                type="text" 
                placeholder="Destination (e.g. Kandy / Ella)" 
                required 
                value={bookingData.destination}
                onChange={(e) => setBookingData({ ...bookingData, destination: e.target.value })} 
              />

              {/* 🟢 travelDate වෙනුවට date ලෙස සකසන ලදී */}
              <input 
                type="date" 
                required 
                value={bookingData.date}
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })} 
              />

              {/* Additional Note */}
              <textarea 
                placeholder="Additional details/notes..." 
                value={bookingData.note}
                onChange={(e) => setBookingData({ ...bookingData, note: e.target.value })} 
              />

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" style={{ flex: 1, background: '#16a34a', color: '#fff', border: 'none', padding: '0.6rem', borderRadius: '5px', cursor: 'pointer' }}>
                  Confirm Request
                </button>
                <button type="button" onClick={() => setSelectedDriver(null)} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '0.6rem', borderRadius: '5px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;