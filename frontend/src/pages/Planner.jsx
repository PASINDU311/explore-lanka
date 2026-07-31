import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const Planner = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tripTitle: '',
    durationDays: 3,
    travelStyle: 'Culture',
    estimatedBudgetLKR: 50000
  });

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🟢 Storage දෙකෙන්ම Token එක පරීක්ෂා කිරීම
  const getAuthToken = () => {
    return (
      localStorage.getItem('token') ||
      sessionStorage.getItem('token') ||
      JSON.parse(localStorage.getItem('user') || '{}')?.token ||
      JSON.parse(sessionStorage.getItem('user') || '{}')?.token ||
      null
    );
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');

    const token = getAuthToken();

    if (!token) {
      alert('Please Login first as a Tourist to generate an AI Travel Plan!');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);

      const res = await API.post('/itineraries/generate', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setItinerary(res.data);
    } catch (err) {
      console.error('Error generating itinerary:', err);
      setError(err.response?.data?.message || 'Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '1.5rem', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#0f172a', fontSize: '2.2rem', marginBottom: '0.4rem' }}>
          ✨ AI Travel Itinerary Generator
        </h2>
        <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>
          Fill in your preferences and let our system craft your perfect Sri Lanka tour plan.
        </p>
      </div>

      {/* --- FORM SECTION --- */}
      <form 
        onSubmit={handleGenerate} 
        style={{ 
          background: '#f8fafc', 
          padding: '1.8rem', 
          borderRadius: '12px', 
          border: '1px solid #cbd5e1', 
          display: 'grid', 
          gap: '1.2rem' 
        }}
      >
        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.8rem', borderRadius: '6px', fontSize: '0.9rem' }}>
            ⚠️ {error}
          </div>
        )}

        <div>
          <label style={{ fontWeight: 'bold', color: '#334155' }}>Trip Name / Title:</label>
          <input 
            type="text" 
            name="tripTitle" 
            placeholder="e.g. My Magical Coastal & Heritage Tour" 
            value={formData.tripTitle} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '0.7rem', marginTop: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ fontWeight: 'bold', color: '#334155' }}>Duration (Days):</label>
            <input 
              type="number" 
              name="durationDays" 
              min="1" 
              max="14" 
              value={formData.durationDays} 
              onChange={handleChange} 
              required
              style={{ width: '100%', padding: '0.7rem', marginTop: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
            />
          </div>

          <div>
            <label style={{ fontWeight: 'bold', color: '#334155' }}>Travel Style:</label>
            <select 
              name="travelStyle" 
              value={formData.travelStyle} 
              onChange={handleChange}
              style={{ width: '100%', padding: '0.7rem', marginTop: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
            >
              <option value="Culture">Culture & Heritage</option>
              <option value="Beach & Relaxation">Beach & Relaxation</option>
              <option value="Adventure & Hiking">Adventure & Hiking</option>
              <option value="Wildlife Safari">Wildlife Safari</option>
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 'bold', color: '#334155' }}>Budget (LKR):</label>
            <input 
              type="number" 
              name="estimatedBudgetLKR" 
              value={formData.estimatedBudgetLKR} 
              onChange={handleChange} 
              required
              style={{ width: '100%', padding: '0.7rem', marginTop: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            background: loading ? '#94a3b8' : '#0284c7', 
            color: '#fff', 
            border: 'none', 
            padding: '0.8rem', 
            borderRadius: '6px', 
            fontSize: '1rem', 
            cursor: loading ? 'not-allowed' : 'pointer', 
            fontWeight: 'bold',
            marginTop: '0.5rem'
          }}
        >
          {loading ? 'Generating Plan... 🤖' : 'Generate Itinerary 🚀'}
        </button>
      </form>

      {/* --- DISPLAY GENERATED ITINERARY --- */}
      {itinerary && (
        <div style={{ marginTop: '2.5rem', background: '#fff', border: '2px solid #38bdf8', borderRadius: '12px', padding: '1.8rem', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ color: '#0369a1', margin: 0, fontSize: '1.5rem' }}>📍 {itinerary.tripTitle}</h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', margin: '0.4rem 0 0 0' }}>
                Style: <strong>{itinerary.travelStyle}</strong> | Budget: <strong>LKR {Number(itinerary.estimatedBudgetLKR).toLocaleString()}</strong>
              </p>
            </div>

            <button 
              onClick={() => navigate('/drivers')}
              style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              🛺 Find & Book a Driver
            </button>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1.2rem 0' }} />

          {/* Day-by-Day Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {itinerary.dayPlans && itinerary.dayPlans.map((day) => (
              <div key={day.dayNumber} style={{ background: '#f0f9ff', borderLeft: '5px solid #0284c7', padding: '1.2rem', borderRadius: '0 8px 8px 0' }}>
                <h4 style={{ margin: 0, color: '#0c4a6e', fontSize: '1.1rem' }}>
                  🗓️ Day {day.dayNumber}
                </h4>
                
                {day.note && (
                  <p style={{ fontSize: '0.9rem', color: '#475569', margin: '0.3rem 0 0.8rem 0', fontStyle: 'italic' }}>
                    {day.note}
                  </p>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.8rem', marginTop: '0.6rem' }}>
                  {day.placesToVisit && day.placesToVisit.length > 0 ? (
                    day.placesToVisit.map((place, idx) => (
                      <div key={place._id || idx} style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '0.8rem', borderRadius: '8px' }}>
                        <strong style={{ fontSize: '0.95rem', color: '#1e293b', display: 'block', marginBottom: '0.2rem' }}>
                          📍 {place.name || place.title}
                        </strong>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                          District: {place.district || 'Sri Lanka'}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
                      Free time for leisure and exploring nearby attractions.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};

export default Planner;