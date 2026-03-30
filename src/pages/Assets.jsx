import React, { useState } from 'react';
import SidebarLayout from '../components/SidebarLayout';

export default function Assets() {
  const [cashInput, setCashInput] = useState('');
  const [investInput, setInvestInput] = useState('');
  const [otherInput, setOtherInput] = useState('');
  const [liabInput, setLiabInput] = useState('');

  const [assets, setAssets] = useState(() => JSON.parse(localStorage.getItem('wealthTrackAssets')) || null);
  const [dashboardHistory] = useState(() => JSON.parse(localStorage.getItem('wealthTrackHistory')) || []);
  const [profile] = useState(() => JSON.parse(localStorage.getItem('wealthLensProfile')) || { currency: '₹' });
  const [targets] = useState(() => JSON.parse(localStorage.getItem('wealthLensTargets')) || { efMonths: 6 });

  const handleSaveAssets = () => {
    const cash = parseFloat(cashInput) || 0;
    const invest = parseFloat(investInput) || 0;
    const other = parseFloat(otherInput) || 0;
    const liab = parseFloat(liabInput) || 0;

    const assetData = { cash, invest, other, liab, totalAssets: cash + invest + other, netWorth: (cash + invest + other) - liab };
    setAssets(assetData);
    localStorage.setItem('wealthTrackAssets', JSON.stringify(assetData));
    setCashInput(''); setInvestInput(''); setOtherInput(''); setLiabInput('');
    alert("Portfolio Updated!");
  };

  const cur = profile.currency;
  const netWorthDisplay = assets ? assets.netWorth.toLocaleString('en-IN') : '0';
  const liabDisplay = assets ? assets.liab.toLocaleString('en-IN') : '0';

  let monthsCovered = '0.0';
  let insightText = "Emergency Fund is calculated using liquid cash against average monthly expenses.";

  if (assets && dashboardHistory.length > 0) {
    const totalExp = dashboardHistory.reduce((sum, item) => sum + item.expenses, 0);
    const avgExp = totalExp / dashboardHistory.length;
    if (avgExp > 0) monthsCovered = (assets.cash / avgExp).toFixed(1);

    if (parseFloat(monthsCovered) < targets.efMonths) insightText = `⚠️ Below Target: Liquid cash covers ${monthsCovered} months (Target: ${targets.efMonths}).`;
    else insightText = `✅ Strong Runway: You have ${monthsCovered} months of coverage (Target: ${targets.efMonths}).`;
  }

  return (
    <SidebarLayout>
      <div className="stats-row">
        <div className="stat-card"><span className="label">Total Net Worth</span><span className="value">{cur}{netWorthDisplay}</span></div>
        <div className="stat-card"><span className="label">Total Liabilities</span><span className="value">{cur}{liabDisplay}</span></div>
        <div className="stat-card"><span className="label">Emergency Fund</span><span className="value">{monthsCovered} Mo.</span></div>
      </div>

      <div className="content-grid">
        <div className="card">
          <h3 style={{ margin: '0 0 20px 0' }}>Asset & Liability Input</h3>
          <div className="input-group"><label>Liquid Cash & Bank</label><input type="number" value={cashInput} onChange={(e) => setCashInput(e.target.value)} /></div>
          <div className="input-group"><label>Investments</label><input type="number" value={investInput} onChange={(e) => setInvestInput(e.target.value)} /></div>
          <div className="input-group"><label>Fixed Assets</label><input type="number" value={otherInput} onChange={(e) => setOtherInput(e.target.value)} /></div>
          <div className="input-group"><label>Total Liabilities</label><input type="number" value={liabInput} onChange={(e) => setLiabInput(e.target.value)} /></div>
          <button className="btn-primary" onClick={handleSaveAssets}>Update Portfolio</button>
        </div>

        <div className="card">
          <h3 style={{ margin: '0 0 25px 0' }}>Portfolio Distribution</h3>
          <div style={{ overflowX: 'auto' }}>
            {!assets ? <p style={{ color: '#94A3B8' }}>No data available yet.</p> : (
              <table>
                <thead><tr><th>Category</th><th>Value</th></tr></thead>
                <tbody>
                  <tr><td>Liquid Cash</td><td>{cur}{assets.cash.toLocaleString('en-IN')}</td></tr>
                  <tr><td>Investments</td><td>{cur}{assets.invest.toLocaleString('en-IN')}</td></tr>
                  <tr><td>Other Assets</td><td>{cur}{assets.other.toLocaleString('en-IN')}</td></tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <div className="insight-banner"><p style={{ margin: 0 }}>{insightText}</p></div>
    </SidebarLayout>
  );
}