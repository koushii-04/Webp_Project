import React, { useState } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  
  const [name, setName] = useState(() => (JSON.parse(localStorage.getItem('wealthLensProfile')) || {}).name || 'User');
  const [currency, setCurrency] = useState(() => (JSON.parse(localStorage.getItem('wealthLensProfile')) || {}).currency || '₹');
  const [rateTarget, setRateTarget] = useState(() => (JSON.parse(localStorage.getItem('wealthLensTargets')) || {}).rateTarget || 30);
  const [efMonths, setEfMonths] = useState(() => (JSON.parse(localStorage.getItem('wealthLensTargets')) || {}).efMonths || 6);

  const handleSaveSettings = () => {
    localStorage.setItem('wealthLensProfile', JSON.stringify({ name, currency }));
    localStorage.setItem('wealthLensTargets', JSON.stringify({ rateTarget: parseFloat(rateTarget) || 30, efMonths: parseFloat(efMonths) || 6 }));
    alert("Settings saved successfully!");
  };

  const handleClearHistory = () => {
    if (window.confirm("Delete all Dashboard history?")) { localStorage.removeItem('wealthTrackHistory'); alert("History cleared."); }
  };

  const handleClearAssets = () => {
    if (window.confirm("Delete your Asset portfolio data?")) { localStorage.removeItem('wealthTrackAssets'); alert("Assets cleared."); }
  };

  const handleWipeAll = () => {
    if (window.confirm("WARNING: Delete all data and account?")) {
      localStorage.clear();
      alert("All data wiped.");
      navigate('/');
    }
  };

  return (
    <SidebarLayout>
      <h2 style={{ color: 'white', marginTop: 0, marginBottom: '30px' }}>Application Settings</h2>
      <div className="content-grid">
        <div className="card">
          <h3 style={{ margin: '0 0 20px 0' }}>Profile & Targets</h3>
          <div className="input-group"><label>Display Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="input-group">
            <label>Preferred Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="₹">₹ (INR)</option><option value="$">$ (USD)</option><option value="€">€ (EUR)</option><option value="£">£ (GBP)</option>
            </select>
          </div>
          <div className="input-group"><label>Target Savings Rate (%)</label><input type="number" value={rateTarget} onChange={(e) => setRateTarget(e.target.value)} /></div>
          <div className="input-group"><label>Emergency Fund Target (Months)</label><input type="number" value={efMonths} onChange={(e) => setEfMonths(e.target.value)} /></div>
          <button className="btn-primary" onClick={handleSaveSettings}>Save Preferences</button>
        </div>

        <div className="card" style={{ border: '1px solid #7F1D1D' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#EF4444' }}>Danger Zone</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button className="btn-warn" onClick={handleClearHistory}>Clear Dashboard History</button>
            <button className="btn-warn" onClick={handleClearAssets}>Clear Asset Portfolio</button>
            <hr style={{ borderColor: '#334155', width: '100%' }} />
            <button className="btn-danger" onClick={handleWipeAll}>Wipe All Data & Delete Account</button>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}