import React from 'react';

const tabs = [
  { id: 'overview', label: 'Resumen', icon: 'fa-th-large' },
  { id: 'insights', label: 'Insights', icon: 'fa-lightbulb' },
  { id: 'progress', label: 'Progreso', icon: 'fa-chart-pie' },
  { id: 'goals', label: 'Objetivos', icon: 'fa-bullseye' },
];

export function DashboardTabs({ activeTab, onTabChange }) {
  return (
    <div className="nav-tabs mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`nav-tab flex items-center gap-2 ${activeTab === tab.id ? 'active' : ''}`}
        >
          <i className={`fas ${tab.icon}`}></i>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
