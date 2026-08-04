import React, { useState, useEffect } from 'react';
import API from '../services/api';

const CATEGORIES = ['All', 'Culture', 'Beach', 'Hiking', 'Wildlife', 'Food'];

const CATEGORY_STYLE = {
  All:      { color: '#8A9E97', label: 'All' },
  Culture:  { color: '#D9A441', label: 'Culture' },
  Beach:    { color: '#2FA4A0', label: 'Beach' },
  Hiking:   { color: '#6B8E4E', label: 'Hiking' },
  Wildlife: { color: '#E0672B', label: 'Wildlife' },
  Food:     { color: '#C4562A', label: 'Food' },
  General:  { color: '#8A9E97', label: 'General' },
};

const CategoryIcon = ({ cat, size = 15 }) => {
  const stroke = '#F5EFE1';
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (cat) {
    case 'Culture':
      return (
        <svg {...common}><path d="M4 20h16" /><path d="M6 20V10M10 20V10M14 20V10M18 20V10" /><path d="M3 10l9-6 9 6" /></svg>
      );
    case 'Beach':
      return (
        <svg {...common}><path d="M3 17c1.5 1.3 3 1.3 4.5 0s3-1.3 4.5 0 3-1.3 4.5 0 3-1.3 4.5 0" /><path d="M3 21c1.5 1.3 3 1.3 4.5 0s3-1.3 4.5 0 3-1.3 4.5 0 3-1.3 4.5 0" /><circle cx="17" cy="6" r="3" /></svg>
      );
    case 'Hiking':
      return (
        <svg {...common}><path d="M3 19l6-12 4 7 2-3 6 8z" /></svg>
      );
    case 'Wildlife':
      return (
        <svg {...common}><circle cx="12" cy="13" r="3" /><circle cx="6" cy="7" r="1.6" /><circle cx="18" cy="7" r="1.6" /><circle cx="3" cy="12" r="1.6" /><circle cx="21" cy="12" r="1.6" /></svg>
      );
    case 'Food':
      return (
        <svg {...common}><path d="M4 3v7a3 3 0 0 0 3 3v8" /><path d="M4 3v7M8 3v7" /><path d="M18 3c-2 1-3 3-3 6a3 3 0 0 0 3 3v9" /></svg>
      );
    default:
      return (
        <svg {...common}><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></svg>
      );
  }
};

const Explore = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // 🟢 Database එකේ images Array එක හෝ සෙසු fields පරීක්ෂා කරන Helper Function එක
  const getImageUrl = (place) => {
    // DB එකේ images array එක ඇතුළේ මුල්ම image එක තිබේදැයි බලයි
    const rawPath = (place.images && place.images.length > 0) 
      ? place.images[0] 
      : (place.imageUrl || place.image);

    if (!rawPath) return 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=600';

    const cleanUrl = rawPath.replace(/\\/g, '/');

    // DB එකේ දැනටමත් http://localhost:5000 ලෙස ඇති බැවින් කෙලින්ම return කරයි
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }

    const cleanPath = cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
    return `http://localhost:5000${cleanPath}`;
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/places');
      setPlaces(res.data);
    } catch (err) {
      console.error('Error fetching places:', err);
      setError('Failed to load destinations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPlaces = places.filter((place) => {
    const nameMatch = (place.name || place.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const districtMatch = (place.district || '').toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = selectedCategory === 'All' || place.category === selectedCategory;
    return (nameMatch || districtMatch) && categoryMatch;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
  };

  return (
    <div className="sl-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');

        .sl-page {
          --ink: #0F2E2B;
          --panel: #163C37;
          --panel-edge: #234E48;
          --paper: #F5EFE1;
          --paper-dim: #D9CFB8;
          --gold: #D9A441;
          --coral: #E0672B;
          --sage: #A8C4BE;
          font-family: 'Inter', sans-serif;
          background: var(--ink);
          color: var(--paper);
          min-height: 100vh;
          padding-bottom: 4rem;
        }

        .sl-hero {
          position: relative;
          padding: 4.5rem 1.5rem 6rem;
          text-align: center;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 20% -10%, rgba(217,164,65,0.16), transparent 55%),
            radial-gradient(ellipse at 85% 10%, rgba(47,164,160,0.18), transparent 50%),
            var(--ink);
        }
        .sl-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--gold);
        }
        .sl-eyebrow::before, .sl-eyebrow::after {
          content: '';
          width: 22px;
          height: 1px;
          background: var(--gold);
          opacity: 0.6;
        }
        .sl-title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: clamp(2.4rem, 5.5vw, 4rem);
          line-height: 1.05;
          margin: 1rem 0 0.9rem;
          color: var(--paper);
        }
        .sl-title em {
          font-style: italic;
          font-weight: 500;
          color: var(--gold);
        }
        .sl-subtitle {
          max-width: 480px;
          margin: 0 auto;
          color: var(--sage);
          font-size: 1.02rem;
          line-height: 1.55;
        }
        .sl-wave {
          position: absolute;
          left: 0; right: 0; bottom: -1px;
          width: 100%;
          height: 46px;
          display: block;
        }

        .sl-filterbar {
          max-width: 980px;
          margin: -3.1rem auto 2.75rem;
          padding: 1.1rem 1.2rem;
          background: var(--panel);
          border: 1px solid var(--panel-edge);
          border-radius: 16px;
          box-shadow: 0 24px 48px -20px rgba(0,0,0,0.55);
          display: flex;
          flex-wrap: wrap;
          gap: 0.9rem;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        .sl-search {
          flex: 1;
          min-width: 240px;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(15,46,43,0.55);
          border: 1px solid var(--panel-edge);
          border-radius: 10px;
          padding: 0.65rem 0.9rem;
        }
        .sl-search svg { flex-shrink: 0; opacity: 0.7; }
        .sl-search input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          color: var(--paper);
          font-size: 0.95rem;
          font-family: 'Inter', sans-serif;
        }
        .sl-search input::placeholder { color: var(--sage); opacity: 0.7; }

        .sl-pills {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .sl-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 0.85rem;
          border-radius: 999px;
          border: 1px solid var(--panel-edge);
          background: transparent;
          color: var(--sage);
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease, transform 0.12s ease;
        }
        .sl-pill:hover { transform: translateY(-1px); border-color: var(--gold); }
        .sl-pill:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
        .sl-pill.active {
          background: var(--pill-color, var(--gold));
          border-color: var(--pill-color, var(--gold));
          color: #0F2E2B;
        }

        .sl-count {
          max-width: 980px;
          margin: 0 auto 1.2rem;
          padding: 0 0.2rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.78rem;
          letter-spacing: 0.05em;
          color: var(--sage);
        }
        .sl-error {
          max-width: 980px;
          margin: 0 auto 1.5rem;
          background: rgba(224,103,43,0.12);
          border: 1px solid rgba(224,103,43,0.4);
          color: #F3C6A8;
          padding: 0.9rem 1.1rem;
          border-radius: 10px;
          text-align: center;
          font-size: 0.9rem;
        }

        .sl-grid {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 1.2rem;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.6rem;
        }

        .sl-card {
          background: var(--paper);
          border-radius: 4px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 14px 30px -16px rgba(0,0,0,0.5);
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          position: relative;
        }
        .sl-card:hover {
          transform: translateY(-5px) rotate(-0.3deg);
          box-shadow: 0 26px 42px -18px rgba(0,0,0,0.6);
        }
        .sl-card-image {
          position: relative;
          height: 178px;
          background: var(--paper-dim);
        }
        .sl-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .sl-stamp {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: 1.5px dashed rgba(245,239,225,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(15,46,43,0.55);
          backdrop-filter: blur(2px);
        }
        .sl-perf {
          height: 0;
          border-top: 1.5px dashed #C9BC9E;
          margin: 0 1.1rem;
          position: relative;
        }
        .sl-card-body {
          padding: 1rem 1.1rem 1.1rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .sl-card-name {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 1.22rem;
          color: var(--ink);
          margin: 0 0 0.25rem;
          line-height: 1.15;
        }
        .sl-card-district {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #7A6F52;
          margin: 0 0 0.65rem;
        }
        .sl-card-desc {
          margin: 0;
          color: #3F4A45;
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .sl-card-footer {
          margin-top: 1rem;
          padding-top: 0.8rem;
          border-top: 1px solid #E4DBC5;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .sl-price {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.82rem;
          font-weight: 500;
          color: #2F6B49;
        }
        .sl-cat-tag {
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--cat-color);
        }

        .sl-skel-card {
          background: var(--panel);
          border: 1px solid var(--panel-edge);
          border-radius: 4px;
          overflow: hidden;
          height: 340px;
        }
        .sl-skel-block {
          background: linear-gradient(90deg, var(--panel) 0%, var(--panel-edge) 50%, var(--panel) 100%);
          background-size: 200% 100%;
          animation: sl-shimmer 1.4s ease-in-out infinite;
        }
        @keyframes sl-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .sl-empty {
          max-width: 980px;
          margin: 0 auto;
          padding: 3.5rem 1.5rem;
          text-align: center;
          border: 1px dashed var(--panel-edge);
          border-radius: 14px;
        }
        .sl-empty h3 {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 1.3rem;
          margin: 1rem 0 0.4rem;
          color: var(--paper);
        }
        .sl-empty p { color: var(--sage); margin: 0 0 1.2rem; font-size: 0.92rem; }
        .sl-reset-btn {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--ink);
          background: var(--gold);
          border: none;
          padding: 0.6rem 1.3rem;
          border-radius: 999px;
          cursor: pointer;
        }
        .sl-reset-btn:hover { filter: brightness(1.05); }

        @media (prefers-reduced-motion: reduce) {
          .sl-card, .sl-pill, .sl-skel-block { transition: none; animation: none; }
        }
      `}</style>

      {/* HERO */}
      <section className="sl-hero">
        <span className="sl-eyebrow">Ceylon, Rediscovered</span>
        <h1 className="sl-title">Explore <em>Sri Lanka</em></h1>
        <p className="sl-subtitle">
          From ancient citadels to rolling surf and misted highlands — find where to go next.
        </p>
        <svg className="sl-wave" viewBox="0 0 1200 46" preserveAspectRatio="none">
          <path d="M0,24 C150,44 300,4 450,24 C600,44 750,4 900,24 C1050,44 1150,14 1200,24 L1200,46 L0,46 Z" fill="#0F2E2B" />
        </svg>
      </section>

      {/* FILTER BAR */}
      <div className="sl-filterbar">
        <div className="sl-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A8C4BE" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search by place or district — Kandy, Sigiriya, Mirissa…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search destinations"
          />
        </div>
        <div className="sl-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`sl-pill${selectedCategory === cat ? ' active' : ''}`}
              style={{ '--pill-color': CATEGORY_STYLE[cat]?.color }}
              aria-pressed={selectedCategory === cat}
            >
              <CategoryIcon cat={cat} />
              {cat}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="sl-error">{error}</div>}

      {loading ? (
        <div className="sl-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="sl-skel-card">
              <div className="sl-skel-block" style={{ height: '178px' }} />
              <div style={{ padding: '1.1rem' }}>
                <div className="sl-skel-block" style={{ height: '18px', width: '70%', marginBottom: '10px', borderRadius: '4px' }} />
                <div className="sl-skel-block" style={{ height: '12px', width: '40%', marginBottom: '14px', borderRadius: '4px' }} />
                <div className="sl-skel-block" style={{ height: '12px', width: '100%', borderRadius: '4px' }} />
              </div>
            </div>
          ))}
        </div>
      ) : filteredPlaces.length === 0 ? (
        <div className="sl-empty">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="1.6" style={{ margin: '0 auto' }}>
            <circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18" /><path d="M12 12l4-2-2 4-4 2 2-4z" fill="#D9A441" stroke="none" />
          </svg>
          <h3>No destinations on the map for that search</h3>
          <p>Try a different place name, district, or category.</p>
          <button className="sl-reset-btn" onClick={clearFilters}>Clear filters</button>
        </div>
      ) : (
        <>
          <p className="sl-count">
            SHOWING {filteredPlaces.length} OF {places.length} DESTINATIONS
          </p>
          <div className="sl-grid">
            {filteredPlaces.map((place) => {
              const catKey = CATEGORY_STYLE[place.category] ? place.category : 'General';
              const catColor = CATEGORY_STYLE[catKey].color;
              
              // 🟢 Entire place object එක pass කර image URL එක ගනිමු
              const imageSrc = getImageUrl(place);

              // 🟢 Entry fee values matching DB schema (entryFeeUSD / entryFee / price)
              const fee = place.entryFeeUSD ?? place.entryFee ?? place.price ?? 0;

              return (
                <div key={place._id} className="sl-card">
                  <div className="sl-card-image">
                    <img
                      src={imageSrc}
                      alt={place.title || place.name}
                    />
                    <div className="sl-stamp" title={catKey}>
                      <CategoryIcon cat={catKey} size={18} />
                    </div>
                  </div>
                  <div className="sl-perf" />
                  <div className="sl-card-body">
                    <div>
                      <h3 className="sl-card-name">{place.title || place.name}</h3>
                      <p className="sl-card-district">📍 {place.district || 'Sri Lanka'}</p>
                      <p className="sl-card-desc">
                        {place.description
                          ? (place.description.length > 100 ? `${place.description.substring(0, 100)}…` : place.description)
                          : 'No description available.'}
                      </p>
                    </div>
                    <div className="sl-card-footer">
                      <span className="sl-price">
                        {fee > 0 ? `$${fee} entry` : 'Free entry'}
                      </span>
                      <span className="sl-cat-tag" style={{ '--cat-color': catColor }}>{catKey}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Explore;