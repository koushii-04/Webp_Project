import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const storedData = JSON.parse(localStorage.getItem('wealthLensUser'));

    if (!storedData) return alert("No account found. Please sign up first.");
    
    if (username === storedData.username && password === storedData.password) {
      sessionStorage.setItem('isLoggedIn', 'true');
      navigate('/dashboard'); 
    } else {
      alert("Invalid username or password.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 style={{ color: 'white', marginBottom: '20px', marginTop: 0 }}>WealthLens Login</h2>
        <div className="input-group">
          <label>Username</label>
          <input type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="input-group" style={{ marginBottom: '25px' }}>
          <label>Password</label>
          <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={handleLogin}>Unlock Vault</button>
        <p style={{ marginTop: '20px', fontSize: '13px', color: '#94A3B8' }}>
          New here? <Link to="/signup" style={{ color: '#10B981', textDecoration: 'none' }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}