import React from 'react';
import { motion } from 'framer-motion';

const defaultAchievements = [
  { id: 1, name: 'Primera sesión', icon: 'fa-play', description: 'Completa tu primera sesión', earned: false },
  { id: 2, name: 'Consistente', icon: 'fa-calendar-check', description: '7 días consecutivos', earned: false },
  { id: 3, name: 'Maestro emocional', icon: 'fa-heart', description: '10 sesiones positivas', earned: false },
  { id: 4, name: 'Coleccionista', icon: 'fa-trophy', description: '1000 puntos', earned: false },
  { id: 5, name: 'Maratón', icon: 'fa-running', description: '2+ horas de estudio', earned: false },
];

export function GamificationPanel({ gamification }) {
  const level = gamification?.level || 1;
  const totalPoints = gamification?.totalPoints || 0;
  const currentStreak = gamification?.currentStreak || 0;
  const achievements = gamification?.achievements || defaultAchievements;
  
  const pointsToNextLevel = level * 500;
  const currentLevelPoints = totalPoints % pointsToNextLevel;
  const progressPercent = Math.min((currentLevelPoints / pointsToNextLevel) * 100, 100);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="section-title mb-0">Tu progreso</h3>
        <div className="flex items-center gap-2">
          <i className="fas fa-fire text-orange-500"></i>
          <span className="font-semibold">{currentStreak} días</span>
        </div>
      </div>

      {/* Level Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Nivel {level}</span>
          <span className="text-sm text-surface-500">{currentLevelPoints} / {pointsToNextLevel} pts</span>
        </div>
        <div className="progress-bar">
          <motion.div 
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Points */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-surface-50 rounded-lg">
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
          <i className="fas fa-coins text-amber-600 text-xl"></i>
        </div>
        <div>
          <p className="text-sm text-surface-500">Puntos totales</p>
          <p className="text-2xl font-semibold">{totalPoints}</p>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h4 className="text-sm font-medium text-surface-500 mb-3">Logros</h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`flex flex-col items-center p-3 rounded-lg border ${
                achievement.earned 
                  ? 'border-primary-200 bg-primary-50' 
                  : 'border-surface-200 bg-surface-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                achievement.earned ? 'bg-primary-100' : 'bg-surface-200'
              }`}>
                <i className={`fas ${achievement.icon} ${
                  achievement.earned ? 'text-primary-600' : 'text-surface-400'
                }`}></i>
              </div>
              <p className="text-xs font-medium text-center">{achievement.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
