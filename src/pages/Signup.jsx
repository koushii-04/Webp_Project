import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    const user = username.trim();

    if (!user || !password) return alert("Please fill all fields.");
    if (password !== confirmPassword) return alert("Passwords do not match.");

    localStorage.setItem('wealthLensUser', JSON.stringify({ username: user, password }));
    alert("Account created! Please login.");
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 style={{ color: '#10B981', marginBottom: '10px', marginTop: 0 }}>Create Account</h2>
        <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '25px', marginTop: 0 }}>Join WealthLens to track your finances.</p>
        <div className="input-group">
          <label>Username</label>
          <input type="text" placeholder="Choose a username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="input-group" style={{ marginBottom: '25px' }}>
          <label>Confirm Password</label>
          <input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={handleSignup}>Create Account</button>
        <p style={{ marginTop: '20px', fontSize: '13px', color: '#94A3B8' }}>
          Already have an account? <Link to="/" style={{ color: '#10B981', textDecoration: 'none' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
}