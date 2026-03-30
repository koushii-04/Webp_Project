import React, { useState } from 'react';
// Import your external CSS file if you are keeping .input-group and .btn-update classes in it
// import './style.css'; 

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Retrieve stored user data
    const storedData = JSON.parse(localStorage.getItem('wealthLensUser'));

    if (!storedData) {
      alert("No account found. Please sign up first.");
      return;
    }

    if (username === storedData.username && password === storedData.password) {
      // Success: Set session
      sessionStorage.setItem('isLoggedIn', 'true');
      
      // Note: If you are using React Router, replace this with useNavigate() hook:
      // navigate('/dashboard');
      window.location.href = '/dashboard'; 
    } else {
      alert("Invalid username or password.");
    }
  };

  return (
    <div style={styles.body}>
      <div className="auth-card" style={styles.authCard}>
        <div style={{ fontSize: '40px', marginBottom: '10px' }}></div>
        <h2 style={{ color: 'white', marginBottom: '10px' }}>WealthLens Login</h2>
        
        <div className="input-group" style={{ textAlign: 'left', marginTop: '20px' }}>
          <label style={styles.label}>Username</label>
          <input 
            type="text" 
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
        </div>
        
        <div className="input-group" style={{ textAlign: 'left', marginTop: '15px', marginBottom: '20px' }}>
          <label style={styles.label}>Password</label>
          <input 
            type="password" 
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>

        <button className="btn-update" onClick={handleLogin} style={styles.button}>
          Unlock Vault
        </button>
        
        <p style={{ marginTop: '20px', fontSize: '13px', color: '#94A3B8' }}>
          New here?{' '}
          {/* Use <Link to="/signup"> if using React Router */}
          <a href="/signup" style={{ color: 'var(--accent-green)', textDecoration: 'none' }}>
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}

// Inline styles translated from your <style> block
const styles = {
  body: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#0F172A',
    margin: 0,
    fontFamily: "'Inter', sans-serif",
  },
  authCard: {
    width: '100%',
    maxWidth: '400px',
    background: '#1E293B',
    padding: '40px',
    borderRadius: '12px',
    border: '1px solid #334155',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  // Adding basic fallback styles for inputs/buttons in case style.css isn't linked
  label: {
    display: 'block',
    color: '#E2E8F0',
    marginBottom: '8px',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #475569',
    background: '#0F172A',
    color: 'white',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    background: '#10B981', // fallback for your var(--accent-green)
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
  }
};