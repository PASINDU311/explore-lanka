import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Backend එකට email සහ password නිවැරදිව යැවීම
      const res = await API.post('/auth/login', {
        email: formData.email.trim(),
        password: formData.password
      });

      // Session එක Tab එකට පමණක් සීමා කිරීමට sessionStorage හි Save කිරීම
      sessionStorage.setItem('token', res.data.token);
      sessionStorage.setItem('user', JSON.stringify(res.data));

      // User Role අනුව Redirect කිරීම
      if (res.data.role === 'admin') {
        navigate('/admin');
      } else if (res.data.role === 'driver') {
        navigate('/driver-dashboard');
      } else {
        navigate('/');
      }

      window.location.reload(); // UI Update වීම සඳහා
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '3rem auto', padding: '2rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#fff' }}>
      <h2 style={{ textAlign: 'center', color: '#0f172a' }}>🔑 Login</h2>
      
      {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.6rem', borderRadius: '5px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="example@mail.com"
            style={{ width: '100%', padding: '0.6rem', borderRadius: '5px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            style={{ width: '100%', padding: '0.6rem', borderRadius: '5px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '0.7rem', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#64748b' }}>
        Don't have an account? <Link to="/register" style={{ color: '#0284c7' }}>Register here</Link>
      </p>
    </div>
  );
};

export default Login;