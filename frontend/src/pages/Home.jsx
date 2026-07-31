import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');

.sl-page * { box-sizing: border-box; }
.sl-page {
  width: 100%;
  background-color: #0E1B19;
  color: #F3ECDC;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}
.sl-page ::selection { background: #D9A544; color: #0E1B19; }

/* ---------- HERO ---------- */
.sl-hero {
  position: relative;
  min-height: calc(100vh - 70px);
  width: 100%;
  background-image: linear-gradient(to bottom, rgba(14,27,25,0.25), #0E1B19 92%), url('https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1600');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2.5rem 4rem 3rem;
}

.sl-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  font-family: 'Space Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #D9A544;
  animation: fadeInUp 0.8s ease both;
}
.sl-eyebrow .line { width: 40px; height: 1px; background: #D9A544; }

.sl-stamp-corner {
  position: absolute;
  top: 2.5rem;
  right: 4rem;
  transform: rotate(8deg);
  animation: fadeInUp 0.9s ease both;
  animation-delay: 0.15s;
}

.sl-watermark {
  text-align: center;
  font-family: 'Fraunces', serif;
  font-size: clamp(3.2rem, 11vw, 11.5rem);
  font-weight: 600;
  font-style: italic;
  letter-spacing: 0.01em;
  color: #F3ECDC;
  margin: 0.5rem 0 1.5rem;
  user-select: none;
  animation: fadeInUp 1s ease both;
  animation-delay: 0.1s;
}

.sl-hero-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1.5rem;
  z-index: 2;
  max-width: 1300px;
  margin: 0 auto;
  width: 100%;
}

.sl-card-row { display: flex; gap: 1rem; flex-wrap: wrap; }

.sl-stamp-card {
  width: 118px;
  height: 150px;
  border-radius: 4px;
  background-size: cover;
  background-position: center;
  padding: 0.8rem;
  display: flex;
  align-items: flex-end;
  font-family: 'Space Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.02em;
  border: 1px solid rgba(217,165,68,0.4);
  position: relative;
  transition: transform 0.35s ease, border-color 0.35s ease;
}
.sl-stamp-card::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.85), transparent 65%);
}
.sl-stamp-card span { position: relative; z-index: 1; }
.sl-stamp-card:hover { transform: translateY(-6px) rotate(-1deg); border-color: #D9A544; }

.sl-cta {
  background: #D9A544;
  color: #10201F;
  padding: 1rem 2.3rem;
  border-radius: 999px;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  border: 1px solid #D9A544;
  font-size: 0.95rem;
  cursor: pointer;
  letter-spacing: 0.01em;
  transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease;
}
.sl-cta:hover { background: transparent; color: #D9A544; transform: translateY(-2px); }
.sl-cta:focus-visible { outline: 2px solid #D9A544; outline-offset: 3px; }

/* ---------- SIGNATURE STAMP ---------- */
.stamp {
  width: 84px; height: 84px;
  border-radius: 50%;
  border: 1.5px dashed #D9A544;
  display: flex; align-items: center; justify-content: center;
  text-align: center;
  font-family: 'Space Mono', monospace;
  font-size: 0.58rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #D9A544;
  flex-shrink: 0;
  line-height: 1.3;
}

/* ---------- SECTION SCAFFOLD ---------- */
.sl-section { padding: 6rem 4rem; max-width: 1200px; margin: 0 auto; }
.sl-section-head { display: flex; align-items: center; margin: 0 0 4rem; gap: 0; }
.sl-section-head .rule { flex: 1; height: 1px; background: rgba(243,236,220,0.15); }
.sl-section-head h2 {
  padding: 0 2rem;
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 500;
  font-size: 2rem;
  letter-spacing: 0.01em;
  color: #F3ECDC;
  white-space: nowrap;
}

/* ---------- ABOUT ---------- */
.sl-about-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 4rem; align-items: center; }
.sl-about-copy p.lead { font-size: 1.2rem; color: #C9BFA8; line-height: 1.8; margin-bottom: 1.6rem; font-family: 'Fraunces', serif; font-weight: 400; }
.sl-about-copy p.sub { font-size: 1rem; color: #8FA39D; line-height: 1.7; }

.sl-timeline { position: relative; border-left: 1px dashed rgba(217,165,68,0.5); padding-left: 2.6rem; display: flex; flex-direction: column; gap: 2.8rem; }
.sl-timeline-item { position: relative; display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
.sl-timeline-node {
  position: absolute; left: -3.35rem;
  width: 42px; height: 42px;
  border-radius: 50%;
  background: #10201F;
  border: 1.5px solid #D9A544;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Space Mono', monospace;
  font-size: 0.68rem;
  color: #D9A544;
}
.sl-timeline-days { font-family: 'Space Mono', monospace; font-size: 0.78rem; color: #8FA39D; letter-spacing: 0.04em; }
.sl-timeline-city { font-family: 'Fraunces', serif; font-size: 1.4rem; font-weight: 600; color: #F3ECDC; margin-top: 0.2rem; }
.sl-timeline-img {
  width: 90px; height: 64px; border-radius: 6px;
  background-size: cover; background-position: center;
  border: 1px solid rgba(217,165,68,0.35);
  transition: transform 0.3s ease;
}
.sl-timeline-item:hover .sl-timeline-img { transform: scale(1.05); }

/* ---------- INCLUDED ---------- */
.sl-included-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; }
.sl-included-card {
  background: rgba(243,236,220,0.03);
  border: 1px solid rgba(243,236,220,0.1);
  border-radius: 14px;
  padding: 2rem;
  transition: border-color 0.3s ease, transform 0.3s ease, background 0.3s ease;
}
.sl-included-card:hover { border-color: rgba(217,165,68,0.5); transform: translateY(-4px); background: rgba(243,236,220,0.05); }
.sl-included-icon {
  width: 46px; height: 46px; border-radius: 50%;
  border: 1px solid rgba(217,165,68,0.5);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.3rem; margin-bottom: 1.2rem;
}
.sl-included-card h3 { font-family: 'Fraunces', serif; font-weight: 600; font-size: 1.2rem; margin: 0 0 0.6rem; color: #F3ECDC; }
.sl-included-card p { font-size: 0.88rem; color: #8FA39D; line-height: 1.6; margin: 0; }

/* ---------- CONTACT ---------- */
.sl-contact {
  position: relative; min-height: 80vh; width: 100%;
  background-image: linear-gradient(to top, rgba(14,27,25,0.96), rgba(14,27,25,0.55)), url('https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=1600');
  background-size: cover; background-position: center;
  padding: 6rem 4rem 2rem;
  display: flex; flex-direction: column; justify-content: space-between;
}
.sl-contact-card {
  max-width: 460px;
  background: rgba(16,32,31,0.72);
  backdrop-filter: blur(16px);
  border: 1px dashed rgba(217,165,68,0.55);
  border-radius: 6px;
  padding: 2.6rem;
  position: relative;
}
.sl-contact-card .stamp { position: absolute; top: -28px; right: -18px; transform: rotate(9deg); background: #0E1B19; }
.sl-contact-card h3 { font-family: 'Fraunces', serif; font-weight: 600; font-size: 1.6rem; margin: 0 0 0.5rem; }
.sl-contact-card p.hint { font-size: 0.85rem; color: #8FA39D; margin-bottom: 1.8rem; }
.sl-form { display: flex; flex-direction: column; gap: 1.3rem; }
.sl-form input {
  background: transparent; border: none; border-bottom: 1px solid rgba(243,236,220,0.25);
  padding: 0.7rem 0; color: #F3ECDC; outline: none; font-family: 'Inter', sans-serif; font-size: 0.95rem;
  transition: border-color 0.25s ease;
}
.sl-form input::placeholder { color: #6B7A76; }
.sl-form input:focus { border-color: #D9A544; }
.sl-form button {
  margin-top: 0.6rem; background: #D9A544; color: #10201F; border: none;
  padding: 0.85rem; border-radius: 999px; font-weight: 700; cursor: pointer;
  transition: background 0.25s ease, transform 0.25s ease, color 0.25s ease;
}
.sl-form button:hover { background: #F3ECDC; transform: translateY(-2px); }
.sl-form button:focus-visible, .sl-form input:focus-visible { outline: 2px solid #D9A544; outline-offset: 2px; }

.sl-footer {
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;
  margin-top: 4rem; padding-top: 2rem;
  border-top: 1px solid rgba(243,236,220,0.1);
  font-family: 'Space Mono', monospace;
  font-size: 0.76rem; letter-spacing: 0.02em;
  color: #6B7A76;
}
.sl-footer a { color: #8FA39D; text-decoration: none; }
.sl-footer a:hover { color: #D9A544; }

@keyframes fadeInUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 768px) {
  .sl-hero { padding: 2rem 1.3rem 2rem; }
  .sl-stamp-corner { top: 1.3rem; right: 1.3rem; transform: rotate(8deg) scale(0.75); }
  .sl-section { padding: 4rem 1.3rem; }
  .sl-contact { padding: 4rem 1.3rem 1.5rem; }
  .sl-section-head h2 { font-size: 1.2rem; letter-spacing: 0.08em; padding: 0 1rem; }
  .sl-timeline { padding-left: 2rem; }
  .sl-timeline-node { left: -2.75rem; width: 34px; height: 34px; font-size: 0.6rem; }
  .sl-timeline-city { font-size: 1.1rem; }
  .sl-hero-footer { align-items: flex-start; flex-direction: column; }
}

@media (prefers-reduced-motion: reduce) {
  .sl-page * { animation: none !important; transition: none !important; }
}
`;

const Home = () => {
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({ name: '', phone: '', comment: '' });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! We will get back to you soon.');
    setContactForm({ name: '', phone: '', comment: '' });
  };

  const destinations = [
    { title: 'Cultural Triangle', img: 'https://images.unsplash.com/photo-1588598056902-12499696e57a?q=80&w=300' },
    { title: '10 day tour', img: 'https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=300' },
    { title: 'Scenic trains', img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=300' },
    { title: 'Ceylon tea', img: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=300' },
    { title: 'Wildlife safari', img: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=300' }
  ];

  const itinerary = [
    { days: 'Days 1–3', city: 'Cultural Triangle & Kandy', img: 'https://images.unsplash.com/photo-1588598056902-12499696e57a?q=80&w=200' },
    { days: 'Days 4–6', city: 'Nuwara Eliya & Ella', img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=200' },
    { days: 'Days 7–10', city: 'Mirissa & Galle Fort', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=200' }
  ];

  const included = [
    { title: 'AI Itinerary', desc: 'A custom day-by-day route generated instantly around your budget and pace.', icon: '🤖' },
    { title: 'Verified Drivers', desc: 'Book vetted local drivers with vehicles matched to your group size.', icon: '🛺' },
    { title: 'Local Guides', desc: 'Guides who know the hidden trails and the real history behind each stop.', icon: '🗺️' },
    { title: 'Hotels & Stay', desc: 'Handpicked eco-lodges and beach stays, breakfast always included.', icon: '🏨' }
  ];

  return (
    <div className="sl-page">
      <style>{styles}</style>

      {/* 1. HERO */}
      <section className="sl-hero">
        <div className="sl-eyebrow">
          <span className="line" />
          Island itinerary · AI generated
        </div>

        <div className="sl-stamp-corner">
          <div className="stamp">
            entry<br />granted<br />✦ LK ✦
          </div>
        </div>

        <div className="sl-watermark">Sri Lanka</div>

        <div className="sl-hero-footer">
          <div className="sl-card-row">
            {destinations.map((card, idx) => (
              <div
                key={idx}
                className="sl-stamp-card"
                style={{ backgroundImage: `url(${card.img})` }}
              >
                <span>{card.title}</span>
              </div>
            ))}
          </div>

          <button className="sl-cta" onClick={() => navigate('/planner')}>
            Plan my route →
          </button>
        </div>
      </section>

      {/* 2. ABOUT THE TOUR */}
      <section id="about" className="sl-section">
        <div className="sl-section-head">
          <div className="rule" />
          <h2>About the tour</h2>
          <div className="rule" />
        </div>

        <div className="sl-about-grid">
          <div className="sl-about-copy">
            <p className="lead">
              We've crafted a seamless, intelligent itinerary for your journey across Sri Lanka —
              ancient heritage, serene tea mountains, and tropical golden beaches.
            </p>
            <p className="sub">
              No need to worry about routes, schedules, or finding trusted drivers — everything is
              auto-organized by AI. We show you where to stay, what to experience, and how to travel comfortably.
            </p>
          </div>

          <div className="sl-timeline">
            {itinerary.map((step, i) => (
              <div key={i} className="sl-timeline-item">
                <div className="sl-timeline-node">{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <div className="sl-timeline-days">{step.days}</div>
                  <div className="sl-timeline-city">{step.city}</div>
                </div>
                <div className="sl-timeline-img" style={{ backgroundImage: `url(${step.img})` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHAT'S INCLUDED */}
      <section id="included" className="sl-section" style={{ paddingTop: '0' }}>
        <div className="sl-section-head">
          <div className="rule" />
          <h2>What's included</h2>
          <div className="rule" />
        </div>

        <div className="sl-included-grid">
          {included.map((item, idx) => (
            <div key={idx} className="sl-included-card">
              <div className="sl-included-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CONTACT + FOOTER */}
      <section id="contact" className="sl-contact">
        <div className="sl-contact-card">
          <div className="stamp">reply<br />within<br />24 hrs</div>
          <h3>Still have questions?</h3>
          <p className="hint">Leave a request and our Sri Lanka travel team will get back to you.</p>

          <form className="sl-form" onSubmit={handleContactSubmit}>
            <input
              type="text"
              placeholder="Your name"
              required
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone number / email"
              required
              value={contactForm.phone}
              onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
            />
            <input
              type="text"
              placeholder="Comment or questions"
              value={contactForm.comment}
              onChange={(e) => setContactForm({ ...contactForm, comment: e.target.value })}
            />
            <button type="submit">Send request</button>
          </form>
        </div>

        <footer className="sl-footer">
          <div>Explore Lanka Tours © 2026. All rights reserved.</div>
        </footer>
      </section>
    </div>
  );
};

export default Home;