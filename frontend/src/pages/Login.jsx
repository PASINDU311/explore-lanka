import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/auth/login', {
        email: formData.email.trim(),
        password: formData.password
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      sessionStorage.setItem('token', res.data.token);
      sessionStorage.setItem('user', JSON.stringify(res.data));

      if (res.data.role === 'admin') navigate('/admin');
      else if (res.data.role === 'driver') navigate('/driver-dashboard');
      else navigate('/');

      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100%',
      backgroundColor: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden'
    }}>
      {/* 🌊 LEFT HERO SECTION */}
      <div style={{
        flex: '1.2',
        position: 'relative',
        backgroundImage: `linear-gradient(to bottom, rgba(10,25,35,0.4), rgba(10,20,30,0.7)), url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1600')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justify: 'center',
        alignItems: 'center',
        padding: '0 4rem',
        color: '#ffffff',
        zIndex: 1
      }}>
        {/* Wavy Edge Divider */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: -1,
          width: '180px',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 3
        }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path d="M0,0 C80,25 -20,55 70,80 C110,92 40,100 100,100 L100,0 Z" fill="#ffffff" />
          </svg>
        </div>

        {/* Decorative Circle Overlay */}
        <div style={{
          position: 'absolute',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(4px)',
          left: '10%',
          bottom: '15%',
          pointerEvents: 'none'
        }} />

        {/* Hero Text */}
        <div style={{ maxWidth: '500px', zIndex: 2, textAlign: 'center' }}>
          <h1 style={{
            fontSize: '2.4rem',
            fontWeight: '800',
            lineHeight: '1.25',
            letterSpacing: '-0.5px',
            color: '#ffffff',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            Explore Sri Lanka with AI Powered Smart Travel Planning
          </h1>
        </div>
      </div>

      {/* 🔑 RIGHT FORM SECTION */}
      <div style={{
        flex: '1',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justify: 'center',
        alignItems: 'center',
        padding: '2rem 3rem',
        backgroundColor: '#ffffff',
        zIndex: 2,
        height: '100vh',
        boxSizing: 'border-box'
      }}>
        <div style={{ position: 'absolute', top: '2rem', right: '3rem', cursor: 'pointer' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="8" x2="21" y2="8"></line>
            <line x1="9" y1="16" x2="21" y2="16"></line>
          </svg>
        </div>

        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h2 style={{
            fontSize: '2.4rem',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '1.5rem',
            letterSpacing: '-1px',
            lineHeight: '1.1'
          }}>
            Welcome<br />Back
          </h2>

          {error && (
            <div style={{
              background: '#fef2f2',
              borderLeft: '4px solid #ef4444',
              color: '#991b1b',
              padding: '0.7rem 1rem',
              borderRadius: '6px',
              marginBottom: '1rem',
              fontSize: '0.85rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.3rem' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.3rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem 0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#0f172a', borderRadius: '4px' }}
                />
                Remember me
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Reset link sent'); }} style={{ color: '#0f172a', textDecoration: 'none', fontWeight: '600' }}>
                Forgot Password
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: '#18181b',
                color: '#ffffff',
                border: 'none',
                padding: '0.85rem',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '0.2rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '1.2rem 0', color: '#94a3b8', fontSize: '0.8rem' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
            <span style={{ padding: '0 0.8rem', fontWeight: '500' }}>Or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
          </div>

          <button
            type="button"
            onClick={() => alert('Google Sign-In ready')}
            style={{
              width: '100%',
              background: '#ffffff',
              color: '#334155',
              border: '1px solid #d1d5db',
              padding: '0.75rem',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Sign in with Google
          </button>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#0f172a', fontWeight: '700', textDecoration: 'none' }}>
              Register here
            </Link>
          </p>
        </div>

        <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '180px', height: '180px', pointerEvents: 'none' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <circle cx="100" cy="100" r="80" fill="#0f172a" />
            <circle cx="100" cy="100" r="90" fill="none" stroke="#0f172a" strokeWidth="1" opacity="0.3" />
            <circle cx="100" cy="100" r="100" fill="none" stroke="#0f172a" strokeWidth="1" opacity="0.2" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Login;