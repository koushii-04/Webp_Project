import React, { useState } from 'react';
import SidebarLayout from '../components/SidebarLayout';

export default function Dashboard() {
  const [month, setMonth] = useState('');
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');

  // Lazy Initialize State from LocalStorage
  const [history, setHistory] = useState(() => {
    return JSON.parse(localStorage.getItem('wealthTrackHistory')) || [];
  });

  const [profile] = useState(() => {
    return JSON.parse(localStorage.getItem('wealthLensProfile')) || {
      currency: '₹',
      name: 'User'
    };
  });

  const [targets] = useState(() => {
    return JSON.parse(localStorage.getItem('wealthLensTargets')) || {
      rateTarget: 30
    };
  });

  const handleSave = () => {
    const inc = parseFloat(income) || 0;
    const exp = parseFloat(expenses) || 0;

    if (inc <= 0) return alert("Please enter a valid income greater than 0.");
    if (!month) return alert("Please select a month.");

    const currentTarget = targets?.rateTarget
      ? parseFloat(targets.rateTarget)
      : 30;

    const netFlow = inc - exp;
    const savingsRate = inc > 0 ? Math.round((netFlow / inc) * 100) : 0;

    let health = 0;
    if (savingsRate >= currentTarget) health += 50;
    else if (savingsRate > 0) health += 25;

    if (netFlow > 0) health += 30;
    if (inc > exp * 2) health += 20;

    health = Math.min(health, 100);

    const entry = {
      month,
      income: inc,
      expenses: exp,
      netFlow,
      savingsRate,
      health,
      timestamp: new Date().getTime()
    };

    const updatedHistory = [...history];
    const idx = updatedHistory.findIndex((h) => h.month === month);

    if (idx > -1) {
      updatedHistory[idx] = entry;
    } else {
      updatedHistory.push(entry);
    }

    setHistory(updatedHistory);
    localStorage.setItem(
      'wealthTrackHistory',
      JSON.stringify(updatedHistory)
    );

    setIncome('');
    setExpenses('');
    setMonth('');
  };

  const handleReset = () => {
    if (window.confirm("Reset everything? This will wipe all dashboard history.")) {
      localStorage.removeItem('wealthTrackHistory');
      setHistory([]);
    }
  };

  // ---------------- DERIVED DATA ----------------
  const cur = profile.currency || '₹';

  const totalSavings = history.reduce(
    (sum, item) => sum + (item.netFlow || 0),
    0
  );

  // Correct sorting by date
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.month) - new Date(a.month)
  );

  // FIXED: pick latest object not array
  const latest = sortedHistory.length > 0 ? sortedHistory[0] : null;

  const displayHealth = latest?.health ?? 0;
  const displayRate = latest?.savingsRate ?? 0;
  const target = targets?.rateTarget
    ? parseFloat(targets.rateTarget)
    : 30;

  let insightText = "Welcome! Add your monthly data to see insights.";

  if (latest) {
    if (displayRate >= target) {
      insightText = `💡 Great job, ${profile.name || 'User'}! You hit your ${target}% savings target.`;
    } else {
      insightText = `💡 ${profile.name || 'User'}, try to reach your ${target}% savings goal next month.`;
    }
  }

  return (
    <SidebarLayout>
      <div className="stats-row">
        <div className="stat-card">
          <span className="label">Total Net Savings</span>
          <span className="value">
            {cur}{totalSavings.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="stat-card">
          <span className="label">Health Score</span>
          <span className="value">{displayHealth}/100</span>
        </div>

        <div className="stat-card">
          <span className="label">Savings Rate</span>
          <span className="value">{displayRate}%</span>
        </div>
      </div>

      <div className="content-grid">
        <div className="card">
          <h3>Monthly Input</h3>

          <div className="input-group">
            <label>Select Month</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Income</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Expenses</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={handleSave}>
            Update Dashboard
          </button>
        </div>

        <div className="card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px'
            }}
          >
            <h3 style={{ margin: 0 }}>History</h3>
            <button className="reset-all" onClick={handleReset}>
              Reset All
            </button>
          </div>

          <div id="history-container">
            {sortedHistory.length === 0 ? (
              <p style={{ color: 'var(--text-grey)' }}>
                No records found.
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Income</th>
                    <th>Net Flow</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedHistory.map((item, index) => {
                    const net = item.netFlow || 0;
                    const flowColor =
                      net >= 0
                        ? 'var(--accent-green)'
                        : 'var(--danger)';

                    return (
                      <tr key={index}>
                        <td>{item.month}</td>
                        <td>
                          {cur}
                          {(item.income || 0).toLocaleString('en-IN')}
                        </td>
                        <td
                          style={{
                            color: flowColor,
                            fontWeight: '700'
                          }}
                        >
                          {cur}{net.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <div className="insight-banner">
        <p style={{ margin: 0 }}>{insightText}</p>
      </div>
    </SidebarLayout>
  );
}

