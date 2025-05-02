import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Setting.css';
import { useNavigate } from 'react-router-dom';

const Setting = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [user, setUser] = useState(null);
  const [ logout, setLogout ] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');
   const { userId } = useContext(UserContext);

  // on mount, load current user details
   useEffect(() => {
      if (!userId) {
        console.error("User ID is not available.");
        return;
      }});

  // common logout routine
  const doLogout = async () => {
    await fetch('https://ticket-management-full-stack.onrender.com/users/logout', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    localStorage.clear();
    navigate('/');
  };

  const handleSave = async () => {
    const userRes = await fetch(`https://ticket-management-full-stack.onrender.com/users/getUserDetails/${userId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!userRes.ok) {
      throw new Error("Failed to fetch user details.");
    }
    const { user } = await userRes.json();
    setUser(user);

    // Check if the user is authorized to change the password
    if ((password || confirm) && user.role !== 'captain-admin') {
      toast.error('Unauthorized');
      return;
    }

    // Ensure passwords match
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }

    // Dynamically construct the payload
    const payload = {};
    if (firstName) payload.firstName = firstName;
    if (lastName) payload.lastName = lastName;
    if (email && email !== user.email) payload.email = email;
    if (password) payload.password = password;

    try {
      const res = await fetch(`https://ticket-management-full-stack.onrender.com/users/updateRegister/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 403) {
        toast.error('Unauthorized');
        return;
      }
      if (!res.ok) throw new Error('Save failed');
      const { user: updated } = await res.json();
      setUser(prev => ({ ...prev, ...updated }));
      toast.success('Profile updated');
      if (logout) {
        toast.info('Logging out...');
        setTimeout(() => {
          doLogout();
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      toast.error('Could not save changes');
    }
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      <div className="settings-card">
        <div className="tabs">
          <button
            className={activeTab === 'edit' ? 'active' : ''}
            onClick={() => setActiveTab('edit')}
          >
            Edit Profile
          </button>
        </div>

        <div className="form">
          <label>First name</label>
          <input
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />

          <label>Last name</label>
          <input
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              setLogout(true);
            }}
          />
          <span className="info-icon" title="Changing email will log you out immediately">ℹ️</span>

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              setLogout(true);
            }}
          />
          <span className="info-icon" title="Changing password will log you out immediately">ℹ️</span>

          <label>Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={e => {
              setConfirm(e.target.value);
              setLogout(true);
              // if (password !== e.target.value) {
              //   toast.error('Passwords do not match');
              // }
            }}
          />
          <span className="info-icon" title="Changing password will log you out immediately">ℹ️</span>

          <div className="actions">
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Setting;
