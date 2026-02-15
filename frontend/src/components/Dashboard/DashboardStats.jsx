import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  {
    label: 'Sesiones totales',
    value: 'sessions',
    icon: 'fa-book-open',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    label: 'Puntuación promedio',
    value: 'avgScore',
    icon: 'fa-chart-line',
    color: 'bg-green-100 text-green-600',
  },
  {
    label: 'Esta semana',
    value: 'weekSessions',
    icon: 'fa-calendar-week',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    label: 'Racha actual',
    value: 'streak',
    icon: 'fa-fire',
    color: 'bg-orange-100 text-orange-600',
  },
];

function StatCard({ stat, data, delay }) {
  const value = data?.[stat.value] ?? (stat.value === 'avgScore' ? 0 : 0);
  const displayValue = stat.value === 'avgScore' ? `${value}%` : value;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="card flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
        <i className={`fas ${stat.icon} text-lg`}></i>
      </div>
      <div>
        <p className="text-sm text-surface-500">{stat.label}</p>
        <p className="text-2xl font-semibold text-surface-900">{displayValue}</p>
      </div>
    </motion.div>
  );
}

export function DashboardStats({ analytics, gamification }) {
  const data = {
    sessions: analytics?.totalSessions || 0,
    avgScore: analytics?.averageScore || 0,
    weekSessions: analytics?.sessionsThisWeek || 0,
    streak: gamification?.currentStreak || 0,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={stat.value} stat={stat} data={data} delay={index * 0.1} />
      ))}
    </div>
  );
}
