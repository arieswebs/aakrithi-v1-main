import React from 'react';

export default function StatsCard({ label, value, icon: Icon, trend, trendValue, color = 'indigo' }) {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {trend && (
          <div className={`stat-trend ${trend}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </div>
        )}
      </div>
      {Icon && (
        <div className={`stat-icon ${color}`}>
          <Icon size={22} />
        </div>
      )}
    </div>
  );
}
