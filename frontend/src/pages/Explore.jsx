import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Explore = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [district, setDistrict] = useState('');

  // Backend එකෙන් Places Fetch කරන Function එක
  const fetchPlaces = async () => {
    try {
      setLoading(true);
      // Query parameters හදාගැනීම
      let queryParams = [];
      if (search) queryParams.push(`search=${search}`);
      if (category) queryParams.push(`category=${category}`);
      if (district) queryParams.push(`district=${district}`);

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const res = await API.get(`/places${queryString}`);
      
      setPlaces(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching places:', err);
      setLoading(false);
    }
  };

  // Filter වෙනස් වෙද්දී Auto-fetch වීම
  useEffect(() => {
    fetchPlaces();
  }, [search, category, district]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Explore Sri Lanka Destinations 🧭</h2>
      <p style={{ color: '#64748b' }}>Discover amazing beaches, cultural places, and hidden gems</p>

      {/* --- FILTER & SEARCH BAR --- */}
      <div style={{ display: 'flex', gap: '1rem', margin: '1.5rem 0', flexWrap: 'wrap', background: '#f1f5f9', padding: '1rem', borderRadius: '8px' }}>
        {/* Search Input */}
        <input 
          type="text" 
          placeholder="Search by title..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '0.6rem', flex: '1', minWidth: '200px', borderRadius: '5px', border: '1px solid #cbd5e1' }}
        />

        {/* Category Dropdown */}
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '0.6rem', borderRadius: '5px', border: '1px solid #cbd5e1' }}
        >
          <option value="">All Categories</option>
          <option value="Beach">Beach</option>
          <option value="Culture">Culture</option>
          <option value="Hiking">Hiking</option>
          <option value="Wildlife">Wildlife</option>
          <option value="Food">Food</option>
        </select>

        {/* District Input */}
        <input 
          type="text" 
          placeholder="District (e.g. Galle, Matale)" 
          value={district} 
          onChange={(e) => setDistrict(e.target.value)}
          style={{ padding: '0.6rem', borderRadius: '5px', border: '1px solid #cbd5e1' }}
        />
      </div>

      {/* --- PLACES GRID DISPLAY --- */}
      {loading ? (
        <h3>Loading Places... ⌛</h3>
      ) : places.length === 0 ? (
        <p>No places found matching your filter criteria.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {places.map((place) => (
            <div key={place._id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <img 
                src={place.images[0] || 'https://via.placeholder.com/300x200?text=ExploreLanka'} 
                alt={place.title} 
                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
              />
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', background: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {place.category}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>📍 {place.district}</span>
                </div>
                
                <h3 style={{ margin: '0.5rem 0' }}>{place.title}</h3>
                <p style={{ color: '#475569', fontSize: '0.9rem', height: '40px', overflow: 'hidden' }}>
                  {place.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                  <strong style={{ color: '#059669' }}>Fee: ${place.entryFeeUSD}</strong>
                  <span>⭐ {place.averageRating || 'New'}</span>
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