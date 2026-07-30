import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'tourist',
    vehicleType: 'TukTuk',
    licenseNumber: '',
    pricePerKm: 0
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        driverDetails: formData.role === 'driver' ? {
          vehicleType: formData.vehicleType,
          licenseNumber: formData.licenseNumber,
          pricePerKm: Number(formData.pricePerKm)
        } : {}
      };

      const res = await API.post('/auth/register', payload);
      
      // Token එක Save කරගෙන Home Page එකට Navigate කිරීම
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      
      alert('Registration Successful! Welcome to ExploreLanka.');
      navigate('/');
      window.location.reload(); // Navbar update වීමට
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '3rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Create Account 🌴</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        
        <label>Account Type:</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="tourist">Tourist / Traveler</option>
          <option value="driver">Driver / Tour Guide</option>
        </select>

        {/* Driver කෙනෙක් තෝරාගතහොත් පමණක් පෙන්වන Inputs */}
        {formData.role === 'driver' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#f8fafc', padding: '1rem' }}>
            <h4>Driver Details</h4>
            <label>Vehicle Type:</label>
            <select name="vehicleType" value={formData.vehicleType} onChange={handleChange}>
              <option value="TukTuk">Tuk-Tuk</option>
              <option value="Car">Car</option>
              <option value="Van">Van</option>
            </select>
            <input type="text" name="licenseNumber" placeholder="License Number" value={formData.licenseNumber} onChange={handleChange} required />
            <input type="number" name="pricePerKm" placeholder="Price Per KM (LKR)" value={formData.pricePerKm} onChange={handleChange} required />
          </div>
        )}

        <button type="submit" style={{ padding: '0.7rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Register
        </button>
      </form>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
};

export default Register;