import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api'; // ඔබගේ API service file එක

const Profile = () => {
  const navigate = useNavigate();

  // Storage එකෙන් පරිශීලක තොරතුරු ලබා ගැනීම
  const getUser = () => {
    try {
      const sessionUser = sessionStorage.getItem('user');
      if (sessionUser) return JSON.parse(sessionUser);

      const localUser = localStorage.getItem('user');
      if (localUser) return JSON.parse(localUser);
    } catch (e) {
      console.error('Error reading user in Profile:', e);
    }
    return null;
  };

  const currentUser = getUser();

  // Edit Mode Toggle කිරීමේ State එක
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form එක සඳහා State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Other'
  });

  // Page එක Load වෙද්දී දැනට තියෙන User Details Form එකට Fill කිරීම
  useEffect(() => {
    if (currentUser) {
      // Name එක කැබලි දෙකකට වෙන් කර ගැනීම (ඇත්නම්)
      const nameParts = (currentUser.name || '').split(' ');
      const first = currentUser.firstName || nameParts[0] || '';
      const last = currentUser.lastName || nameParts.slice(1).join(' ') || '';

      setFormData({
        firstName: first,
        lastName: last,
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        gender: currentUser.gender || 'Other'
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Profile Data Save/Update කිරීම
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const updatedData = {
        name: fullName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender
      };

      // 1. Backend API Call එක (ඔබගේ Endpoint එක අනුව අවශ්‍ය නම් වෙනස් කරන්න)
      const res = await API.put('/auth/profile', updatedData);

      // 2. Storage එකේ ඇති User Object එක Update කිරීම
      const newUserData = { ...currentUser, ...updatedData, ...(res.data?.user || {}) };
      
      if (sessionStorage.getItem('user')) {
        sessionStorage.setItem('user', JSON.stringify(newUserData));
      }
      if (localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify(newUserData));
      }

      alert('Profile details updated successfully!');
      setIsEditing(false);
      window.location.reload(); // Navbar එකේ නම Update වීම සඳහා
    } catch (err) {
      console.error('Update error:', err);
      alert(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  if (!currentUser) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#0F2E2B' }}>
        <h2>User session not found!</h2>
        <Link to="/login" style={{ color: '#D9A441' }}>Please Sign In</Link>
      </div>
    );
  }

  const avatarLetter = formData.firstName ? formData.firstName.charAt(0).toUpperCase() : 'T';

  return (
    <div className="profile-container">
      <style>{`
        .profile-container {
          min-height: 85vh;
          background: #F5EFE1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2.5rem 1rem;
          font-family: 'Inter', sans-serif;
        }

        .profile-card {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(15, 46, 43, 0.08);
          width: 100%;
          max-width: 600px;
          overflow: hidden;
          border: 1px solid rgba(35, 78, 72, 0.15);
        }

        .profile-header {
          background: #0F2E2B;
          padding: 2.5rem 2rem 1.5rem;
          text-align: center;
          position: relative;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #D9A441;
          color: #0F2E2B;
          font-size: 2.2rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          border: 4px solid #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .profile-name {
          color: #F5EFE1;
          font-size: 1.5rem;
          margin: 0;
          font-weight: 600;
        }

        .profile-role-badge {
          display: inline-block;
          margin-top: 0.4rem;
          background: rgba(217, 164, 65, 0.2);
          color: #D9A441;
          border: 1px solid #D9A441;
          padding: 0.25rem 0.8rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .profile-body {
          padding: 2rem;
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .form-row {
          display: flex;
          gap: 1rem;
        }

        .form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-size: 0.78rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          margin-bottom: 0.4rem;
        }

        .form-group input,
        .form-group select {
          padding: 0.7rem 0.9rem;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          font-size: 0.95rem;
          color: #0F2E2B;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #D9A441;
        }

        .form-group input:disabled,
        .form-group select:disabled {
          background: #f8fafc;
          border-color: #e2e8f0;
          color: #334155;
          cursor: not-allowed;
        }

        .profile-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .btn-edit {
          width: 100%;
          background: #D9A441;
          color: #0F2E2B;
          padding: 0.8rem;
          border-radius: 10px;
          border: none;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: filter 0.2s;
        }

        .btn-edit:hover {
          filter: brightness(1.05);
        }

        .btn-save {
          flex: 1;
          background: #0F2E2B;
          color: #F5EFE1;
          padding: 0.8rem;
          border-radius: 10px;
          border: none;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
        }

        .btn-cancel {
          flex: 1;
          background: transparent;
          color: #64748b;
          border: 1px solid #cbd5e1;
          padding: 0.8rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
        }

        .btn-logout-profile {
          margin-top: 1rem;
          width: 100%;
          background: rgba(224, 103, 43, 0.1);
          color: #E0672B;
          border: 1px solid #E0672B;
          padding: 0.75rem;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .btn-logout-profile:hover {
          background: #E0672B;
          color: #ffffff;
        }

        @media (max-width: 500px) {
          .form-row { flex-direction: column; gap: 1.2rem; }
        }
      `}</style>

      <div className="profile-card">
        {/* Header Section */}
        <div className="profile-header">
          <div className="profile-avatar">{avatarLetter}</div>
          <h2 className="profile-name">
            {formData.firstName} {formData.lastName}
          </h2>
          <span className="profile-role-badge">🏝️ {currentUser.role || 'Tourist'}</span>
        </div>

        {/* Body & Form Section */}
        <div className="profile-body">
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  placeholder="+94 7X XXX XXXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Actions Buttons */}
            <div className="profile-actions">
              {!isEditing ? (
                <button
                  type="button"
                  className="btn-edit"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Edit Profile
                </button>
              ) : (
                <>
                  <button type="submit" className="btn-save" disabled={loading}>
                    {loading ? 'Saving...' : '💾 Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>

          <button onClick={handleLogout} className="btn-logout-profile">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;