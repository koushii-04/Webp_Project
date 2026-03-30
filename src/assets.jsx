import React, { useState } from 'react';
// import './style.css'; 

export default function Assets() {
  // Form State
  const [cashInput, setCashInput] = useState('');
  const [investInput, setInvestInput] = useState('');
  const [otherInput, setOtherInput] = useState('');
  const [liabInput, setLiabInput] = useState('');

  // App Data State (Lazy Initialized to fix the ESLint warning)
  const [assets, setAssets] = useState(() => {
    return JSON.parse(localStorage.getItem('wealthTrackAssets')) || null;
  });
  
  // Notice we removed setDashboardHistory, setProfile, and setTargets from the brackets
  
  const [dashboardHistory] = useState(() => {
    return JSON.parse(localStorage.getItem('wealthTrackHistory')) || [];
  });
  
  const [profile] = useState(() => {
    return JSON.parse(localStorage.getItem('wealthLensProfile')) || { currency: '₹' };
  });
  
  const [targets] = useState(() => {
    return JSON.parse(localStorage.getItem('wealthLensTargets')) || { efMonths: 6 };
  });
  
  // Handle Form Submission
  const handleSaveAssets = () => {
    const cash = parseFloat(cashInput) || 0;
    const invest = parseFloat(investInput) || 0;
    const other = parseFloat(otherInput) || 0;
    const liab = parseFloat(liabInput) || 0;

    const totalAssets = cash + invest + other;
    const netWorth = totalAssets - liab;

    const assetData = {
      cash,
      invest,
      other,
      liab,
      totalAssets,
      netWorth
    };

    setAssets(assetData);
    localStorage.setItem('wealthTrackAssets', JSON.stringify(assetData));
    
    // Clear inputs after save
    setCashInput('');
    setInvestInput('');
    setOtherInput('');
    setLiabInput('');
    
    alert("Portfolio Updated!");
  };

  // Derived Values for UI
  const cur = profile.currency;
  const netWorthDisplay = assets ? assets.netWorth.toLocaleString('en-IN') : '0';
  const liabDisplay = assets ? assets.liab.toLocaleString('en-IN') : '0';

  // Emergency Fund Calculation
  let monthsCovered = '0.0';
  let insightText = "Your Emergency Fund is calculated by comparing your liquid cash against your average monthly expenses from the Dashboard.";

  if (assets && dashboardHistory.length > 0) {
    const totalExp = dashboardHistory.reduce((sum, item) => sum + item.expenses, 0);
    const avgExp = totalExp / dashboardHistory.length;
    
    if (avgExp > 0) {
      monthsCovered = (assets.cash / avgExp).toFixed(1);
    }

    if (parseFloat(monthsCovered) < targets.efMonths) {
      insightText = `⚠️ Below Target: Your liquid cash covers ${monthsCovered} months (Target: ${targets.efMonths}).`;
    } else {
      insightText = `✅ Strong Runway: You have ${monthsCovered} months of coverage (Target: ${targets.efMonths}).`;
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0F172A', fontFamily: "'Inter', sans-serif" }}>
      <aside style={styles.aside}>
        <div className="logo-area" style={styles.logo}>WealthTrack</div>
        <nav className="nav-menu" style={styles.nav}>
          <a href="/dashboard" style={styles.navLink}>🏠 Dashboard</a>
          <a href="/assets" className="active" style={{...styles.navLink, color: '#10B981'}}>📈 Assets</a>
          <a href="/settings" style={styles.navLink}>⚙️ Settings</a>
        </nav>
      </aside>

      <main style={styles.main}>
        
        <div className="stats-row" style={styles.statsRow}>
          <div className="stat-card" style={styles.statCard}>
            <span className="label" style={styles.label}>Total Net Worth</span>
            <span className="value" style={styles.value}>
              {cur}{netWorthDisplay}
            </span>
          </div>
          <div className="stat-card" style={styles.statCard}>
            <span className="label" style={styles.label}>Total Liabilities</span>
            <span className="value" style={styles.value}>
              {cur}{liabDisplay}
            </span>
          </div>
          <div className="stat-card" style={styles.statCard}>
            <span className="label" style={styles.label}>Emergency Fund</span>
            <span className="value" style={styles.value}>
              {monthsCovered} Mo.
            </span>
          </div>
        </div>

        <div className="content-grid" style={styles.contentGrid}>
          <div className="card" style={styles.card}>
            <h3 style={styles.cardTitle}>Asset & Liability Input</h3>
            
            <div className="input-group" style={styles.inputGroup}>
              <label style={styles.inputLabel}>Liquid Cash & Bank Balance</label>
              <input 
                type="number" 
                placeholder="e.g. 50000"
                value={cashInput}
                onChange={(e) => setCashInput(e.target.value)}
                style={styles.input}
              />
            </div>
            
            <div className="input-group" style={styles.inputGroup}>
              <label style={styles.inputLabel}>Investments (Stocks, MF, Gold)</label>
              <input 
                type="number" 
                placeholder="e.g. 200000"
                value={investInput}
                onChange={(e) => setInvestInput(e.target.value)}
                style={styles.input}
              />
            </div>
            
            <div className="input-group" style={styles.inputGroup}>
              <label style={styles.inputLabel}>Fixed Assets (Real Estate, Vehicles)</label>
              <input 
                type="number" 
                placeholder="e.g. 1000000"
                value={otherInput}
                onChange={(e) => setOtherInput(e.target.value)}
                style={styles.input}
              />
            </div>

            <div className="input-group" style={styles.inputGroup}>
              <label style={styles.inputLabel}>Total Liabilities (Loans, EMIs)</label>
              <input 
                type="number" 
                placeholder="e.g. 150000"
                value={liabInput}
                onChange={(e) => setLiabInput(e.target.value)}
                style={styles.input}
              />
            </div>
            
            <button className="btn-update" onClick={handleSaveAssets} style={styles.btnUpdate}>
              Update Portfolio
            </button>
          </div>

          <div className="card" style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h3 style={{ margin: 0, color: 'white' }}>Portfolio Distribution</h3>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              {!assets ? (
                <p style={{ color: '#94A3B8' }}>No portfolio data available yet.</p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Asset Category</th>
                      <th style={styles.th}>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #334155' }}>
                      <td style={styles.td}>Liquid Cash</td>
                      <td style={styles.td}>{cur}{assets.cash.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #334155' }}>
                      <td style={styles.td}>Investments</td>
                      <td style={styles.td}>{cur}{assets.invest.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #334155' }}>
                      <td style={styles.td}>Other Assets</td>
                      <td style={styles.td}>{cur}{assets.other.toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="insight-banner" style={styles.insightBanner}>
          <p>{insightText}</p>
        </div>
      </main>
    </div>
  );
}

const styles = {
  aside: { width: '250px', background: '#1E293B', padding: '20px', borderRight: '1px solid #334155' },
  logo: { color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '30px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '15px' },
  navLink: { color: '#94A3B8', textDecoration: 'none', fontSize: '16px', display: 'block' },
  main: { flex: 1, padding: '40px', overflowY: 'auto' },
  statsRow: { display: 'flex', gap: '20px', marginBottom: '30px' },
  statCard: { flex: 1, background: '#1E293B', padding: '20px', borderRadius: '12px', border: '1px solid #334155' },
  label: { display: 'block', color: '#94A3B8', fontSize: '14px', marginBottom: '10px' },
  value: { display: 'block', color: 'white', fontSize: '28px', fontWeight: 'bold' },
  contentGrid: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '30px' },
  card: { background: '#1E293B', padding: '25px', borderRadius: '12px', border: '1px solid #334155' },
  cardTitle: { color: 'white', margin: '0 0 20px 0' },
  inputGroup: { marginBottom: '15px' },
  inputLabel: { display: 'block', color: '#E2E8F0', marginBottom: '8px', fontSize: '14px' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', background: '#0F172A', color: 'white', boxSizing: 'border-box' },
  btnUpdate: { width: '100%', padding: '12px', background: '#10B981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' },
  table: { width: '100%', borderCollapse: 'collapse', color: 'white', textAlign: 'left' },
  th: { padding: '12px', borderBottom: '2px solid #334155', color: '#94A3B8' },
  td: { padding: '12px' },
  insightBanner: { background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981', padding: '15px 20px', borderRadius: '8px', color: '#10B981' }
};