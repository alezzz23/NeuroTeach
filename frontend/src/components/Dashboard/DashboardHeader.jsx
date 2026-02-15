import React from 'react';
import { ThemeToggle } from '../common/ThemeToggle';

export function DashboardHeader({ userData, gamification }) {
  return (
    <header className="flex items-center justify-between pb-6 border-b border-surface-200">
      <div>
        <h1 className="text-2xl font-semibold text-surface-900">
          Hola, {userData?.name || 'Usuario'}
        </h1>
        <p className="text-surface-500 mt-1">
          Aquí está tu resumen de hoy
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-surface-500 uppercase tracking-wide">Nivel</p>
            <p className="font-semibold text-surface-900">{gamification?.level || 1}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <i className="fas fa-star text-primary-600"></i>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-surface-500 uppercase tracking-wide">Puntos</p>
            <p className="font-semibold text-surface-900">{gamification?.totalPoints || 0}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <i className="fas fa-coins text-amber-600"></i>
          </div>
        </div>
        
        <ThemeToggle />
      </div>
    </header>
  );
}
