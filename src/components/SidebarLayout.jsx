import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function SidebarLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  const linkStyle = (path) => ({
    color: location.pathname === path ? '#10B981' : '#94A3B8',
    textDecoration: 'none',
    fontSize: '16px',
    display: 'block',
    padding: '10px 0'
  });

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '30px' }}>
          WealthTrack
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Link to="/dashboard" style={linkStyle('/dashboard')}>🏠 Dashboard</Link>
          <Link to="/assets" style={linkStyle('/assets')}>📈 Assets</Link>
          <Link to="/settings" style={linkStyle('/settings')}>⚙️ Settings</Link>
        </nav>
        <button 
          onClick={handleLogout} 
          style={{ background: 'transparent', color: '#94A3B8', border: '1px solid #475569', padding: '10px', borderRadius: '6px', cursor: 'pointer', textAlign: 'left' }}
        >
          🚪 Logout
        </button>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}