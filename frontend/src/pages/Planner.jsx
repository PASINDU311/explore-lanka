import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const Planner = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

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

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      alert('Please Login first to generate an AI Travel Plan!');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/itineraries/generate', formData);
      setItinerary(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate itinerary');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '1.5rem' }}>
      <h2 style={{ color: '#0f172a' }}>✨ AI Travel Itinerary Generator</h2>
      <p style={{ color: '#64748b' }}>Fill in your preferences and let our system craft your perfect Sri Lanka tour plan.</p>

      {/* --- FORM SECTION --- */}
      <form onSubmit={handleGenerate} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div>
          <label style={{ fontWeight: 'bold' }}>Trip Name / Title:</label>
          <input 
            type="text" 
            name="tripTitle" 
            placeholder="e.g. My Magical Coastal & Heritage Tour" 
            value={formData.tripTitle} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '0.6rem', marginTop: '0.3rem', borderRadius: '5px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontWeight: 'bold' }}>Duration (Days):</label>
            <input 
              type="number" 
              name="durationDays" 
              min="1" 
              max="14" 
              value={formData.durationDays} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '0.6rem', marginTop: '0.3rem', borderRadius: '5px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label style={{ fontWeight: 'bold' }}>Travel Style:</label>
            <select 
              name="travelStyle" 
              value={formData.travelStyle} 
              onChange={handleChange}
              style={{ width: '100%', padding: '0.6rem', marginTop: '0.3rem', borderRadius: '5px', border: '1px solid #cbd5e1' }}
            >
              <option value="Culture">Culture & Heritage</option>
              <option value="Beach & Relaxation">Beach & Relaxation</option>
              <option value="Adventure & Hiking">Adventure & Hiking</option>
              <option value="Wildlife Safari">Wildlife Safari</option>
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 'bold' }}>Budget (LKR):</label>
            <input 
              type="number" 
              name="estimatedBudgetLKR" 
              value={formData.estimatedBudgetLKR} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '0.6rem', marginTop: '0.3rem', borderRadius: '5px', border: '1px solid #cbd5e1' }}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {loading ? 'Generating Plan... 🤖' : 'Generate Itinerary 🚀'}
        </button>
      </form>

      {/* --- DISPLAY GENERATED ITINERARY --- */}
      {itinerary && (
        <div style={{ marginTop: '2.5rem', background: '#fff', border: '1px solid #0284c7', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ color: '#0369a1', margin: 0 }}>📍 {itinerary.tripTitle}</h3>
          <p style={{ color: '#475569', fontSize: '0.9rem' }}>
            Style: <strong>{itinerary.travelStyle}</strong> | Budget: <strong>Rs. {itinerary.estimatedBudgetLKR}</strong>
          </p>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1rem 0' }} />

          {/* Day-by-Day Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {itinerary.dayPlans.map((day) => (
              <div key={day.dayNumber} style={{ background: '#f0f9ff', borderLeft: '4px solid #0284c7', padding: '1rem', borderRadius: '0 8px 8px 0' }}>
                <h4 style={{ margin: 0, color: '#0c4a6e' }}>Day {day.dayNumber}</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0.8rem 0' }}>{day.note}</p>

                {/* Day එකට අදාළ Places ටික පෙන්නමු */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.8rem' }}>
                  {day.placesToVisit.length > 0 ? (
                    day.placesToVisit.map((place) => (
                      <div key={place._id} style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '0.5rem', borderRadius: '6px' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#1e293b' }}>{place.title}</strong>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.2rem 0 0' }}>📍 {place.district}</p>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Free time for leisure and exploring nearby areas.</p>
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