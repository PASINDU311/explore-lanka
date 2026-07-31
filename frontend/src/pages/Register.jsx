import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'tourist',
    vehicleType: '',
    vehicleNumber: '',
    pricePerKm: '',
    licenseNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        driverDetails: formData.role === 'driver' ? {
          vehicleType: formData.vehicleType,
          vehicleNumber: formData.vehicleNumber,
          pricePerKm: Number(formData.pricePerKm),
          licenseNumber: formData.licenseNumber
        } : {}
      };

      const res = await API.post('/auth/register', payload);

      if (formData.role === 'driver') {
        alert('Registration Successful! Your driver account is pending Admin Approval.');
        navigate('/login');
      } else {
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('user', JSON.stringify(res.data));
        alert('Registration Successful!');
        navigate('/');
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
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
            Start Your Unforgettable Journey in Sri Lanka
          </h1>
        </div>
      </div>

      {/* 📝 RIGHT FORM SECTION */}
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
            Create<br />Account
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.2rem' }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.2rem' }}>
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
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.2rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a password"
                  style={{
                    width: '100%',
                    padding: '0.65rem 2.5rem 0.65rem 1rem',
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

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.2rem' }}>
                Register As
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.9rem',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  cursor: 'pointer'
                }}
              >
                <option value="tourist">Tourist (Traveler)</option>
                <option value="driver">Driver</option>
              </select>
            </div>

            {formData.role === 'driver' && (
              <div style={{
                background: '#f8fafc',
                padding: '0.8rem',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <h4 style={{ margin: 0, color: '#0f172a', fontSize: '0.85rem', fontWeight: '700' }}>
                  🛺 Driver Profile Details
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <input type="text" name="vehicleType" placeholder="Vehicle Type" value={formData.vehicleType} onChange={handleChange} required style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }} />
                  <input type="text" name="vehicleNumber" placeholder="Vehicle No" value={formData.vehicleNumber} onChange={handleChange} required style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <input type="number" name="pricePerKm" placeholder="Price/KM (LKR)" value={formData.pricePerKm} onChange={handleChange} required style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }} />
                  <input type="text" name="licenseNumber" placeholder="License No" value={formData.licenseNumber} onChange={handleChange} required style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }} />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: '#18181b',
                color: '#ffffff',
                border: 'none',
                padding: '0.8rem',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '0.92rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '0.3rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.88rem', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#0f172a', fontWeight: '700', textDecoration: 'none' }}>
              Login here
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

export default Register;