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
        // Tourist කෙනෙක් නම් එකපාරම Login කර සාදරයෙන් පිළිගැනීම
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
    <div style={{ maxWidth: '450px', margin: '2rem auto', padding: '2rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#fff' }}>
      <h2 style={{ textAlign: 'center', color: '#0f172a' }}>📝 Register</h2>

      {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.6rem', borderRadius: '5px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem' }}>Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem' }}>Email Address</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem' }}>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem' }}>Register As</label>
          <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}>
            <option value="tourist">Tourist (Traveler)</option>
            <option value="driver">Driver</option>
          </select>
        </div>

        {/* Driver Registration Extra Fields */}
        {formData.role === 'driver' && (
          <div style={{ background: '#f8fafc', padding: '0.8rem', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <h4 style={{ margin: 0, color: '#0284c7' }}>🛺 Driver Profile Details</h4>
            <input type="text" name="vehicleType" placeholder="Vehicle Type (e.g., TukTuk, Car)" value={formData.vehicleType} onChange={handleChange} required style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            <input type="text" name="vehicleNumber" placeholder="Vehicle Number (e.g., WP AB-1234)" value={formData.vehicleNumber} onChange={handleChange} required style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            <input type="number" name="pricePerKm" placeholder="Price Per KM (LKR)" value={formData.pricePerKm} onChange={handleChange} required style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            <input type="text" name="licenseNumber" placeholder="Driving License Number" value={formData.licenseNumber} onChange={handleChange} required style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
          </div>
        )}

        <button type="submit" disabled={loading} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '0.7rem', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#64748b' }}>
        Already have an account? <Link to="/login" style={{ color: '#0284c7' }}>Login here</Link>
      </p>
    </div>
  );
};

export default Register;