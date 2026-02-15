import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultGoals = [
  { id: 1, title: 'Estudiar 5 horas', type: 'time', target: 300, current: 0, timeframe: 'weekly' },
  { id: 2, title: 'Completar 10 sesiones', type: 'sessions', target: 10, current: 0, timeframe: 'weekly' },
  { id: 3, title: 'Mantener racha de 7 días', type: 'streak', target: 7, current: 0, timeframe: 'weekly' },
];

export function DashboardGoals({ history, gamification }) {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('neuroteach_goals');
    return saved ? JSON.parse(saved) : defaultGoals;
  });

  useEffect(() => {
    localStorage.setItem('neuroteach_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    if (history && history.length > 0) {
      const weeklyHistory = history.filter((s) => {
        const sessionDate = new Date(s.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return sessionDate >= weekAgo;
      });

      const totalTime = weeklyHistory.reduce((sum, s) => sum + (s.duration || 0), 0);
      
      setGoals((prev) =>
        prev.map((goal) => {
          switch (goal.type) {
            case 'time':
              return { ...goal, current: totalTime };
            case 'sessions':
              return { ...goal, current: weeklyHistory.length };
            case 'streak':
              return { ...goal, current: gamification?.currentStreak || 0 };
            default:
              return goal;
          }
        })
      );
    }
  }, [history, gamification]);

  const getProgress = (goal) => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="section-title mb-0">Objetivos</h3>
        <span className="text-sm text-surface-500">Esta semana</span>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {goals.map((goal, index) => {
            const progress = getProgress(goal);
            const isCompleted = progress >= 100;
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${
                  isCompleted 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-surface-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-100' : 'bg-surface-100'
                    }`}>
                      <i className={`fas ${
                        goal.type === 'time' ? 'fa-clock' :
                        goal.type === 'sessions' ? 'fa-book' : 'fa-fire'
                      } ${
                        isCompleted ? 'text-green-600' : 'text-surface-500'
                      }`}></i>
                    </div>
                    <span className="font-medium">{goal.title}</span>
                  </div>
                  <span className={`text-sm ${
                    isCompleted ? 'text-green-600 font-medium' : 'text-surface-500'
                  }`}>
                    {goal.current} / {goal.target}
                    {goal.type === 'time' ? ' min' : ''}
                  </span>
                </div>
                <div className="progress-bar">
                  <motion.div 
                    className={`progress-bar-fill ${isCompleted ? 'bg-green-500' : 'bg-brand-green'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
