import React from 'react';
import './DashboardTabs.css';

const tabs = [
  { id: 'learning', label: 'Aprendizaje', icon: 'fa-graduation-cap' },
  { id: 'overview', label: 'Resumen', icon: 'fa-chart-line' },
  { id: 'insights', label: 'Insights IA', icon: 'fa-lightbulb' },
  { id: 'comparisons', label: 'Comparaciones', icon: 'fa-chart-bar' },
  { id: 'goals', label: 'Objetivos', icon: 'fa-target' },
];

export function DashboardTabs({ activeTab, onTabChange }) {
  return (
    <div className="slide-up mb-4">
      <ul className="nav nav-pills nav-fill dashboard-tabs">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.id}>
            <button
              className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <i className={`fas ${tab.icon} me-2`}></i>
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
