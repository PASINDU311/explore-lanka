import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Explore = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search සහ Filter සඳහා States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const res = await API.get('/places');
      setPlaces(res.data);
    } catch (err) {
      console.error('Error fetching places:', err);
      setError('Failed to load destinations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Search සහ Category අනුව Filter කිරීම
  const filteredPlaces = places.filter((place) => {
    const nameMatch = (place.name || place.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const districtMatch = (place.district || '').toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = selectedCategory === 'All' || place.category === selectedCategory;

    return (nameMatch || districtMatch) && categoryMatch;
  });

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: '#0f172a', fontWeight: 'bold' }}>🔄 Loading Destinations...</div>;
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#0f172a', fontSize: '2.2rem', marginBottom: '0.5rem' }}>🌴 Explore Sri Lanka</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Discover top attractions, historic heritage, and beautiful beaches</p>
      </div>

      {/* Search & Category Filter Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#f8fafc',
        padding: '1rem',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        marginBottom: '2rem'
      }}>
        {/* Search Input */}
        <input 
          type="text" 
          placeholder="🔍 Search by Place or District (e.g., Kandy, Sigiriya)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: '1',
            minWidth: '250px',
            padding: '0.7rem 1rem',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '0.95rem'
          }}
        />

        {/* Category Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['All', 'Culture', 'Beach', 'Hiking', 'Wildlife', 'Food'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                background: selectedCategory === cat ? '#0284c7' : '#e2e8f0',
                color: selectedCategory === cat ? '#fff' : '#334155',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {/* Destination Grid */}
      {filteredPlaces.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
          <p style={{ color: '#64748b', fontSize: '1.1rem', margin: 0 }}>No destinations found matching your query!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filteredPlaces.map((place) => (
            <div 
              key={place._id} 
              style={{
                background: '#fff',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {/* Image */}
              <div style={{ position: 'relative', height: '180px', background: '#e2e8f0' }}>
                <img 
                  src={place.imageUrl || place.image || 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=600'} 
                  alt={place.name || place.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  color: '#38bdf8',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {place.category || 'General'}
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.4rem 0', color: '#0f172a', fontSize: '1.2rem' }}>
                    {place.name || place.title}
                  </h3>
                  <p style={{ margin: '0 0 0.8rem 0', color: '#0284c7', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    📍 District: {place.district || 'Sri Lanka'}
                  </p>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    {place.description ? (
                      place.description.length > 100 
                        ? `${place.description.substring(0, 100)}...` 
                        : place.description
                    ) : 'No description available.'}
                  </p>
                </div>

                {/* Card Footer */}
                <div style={{ marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#16a34a' }}>
                    💵 {place.entryFee || place.price ? `$${place.entryFee || place.price} Entry` : 'Free Entry'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;