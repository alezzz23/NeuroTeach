import React from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          family: "'Inter', sans-serif",
          size: 12,
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        color: '#f5f5f5',
      },
    },
  },
};

const emotionColors = {
  feliz: '#22c55e',
  happy: '#22c55e',
  motivado: '#3b82f6',
  motivated: '#3b82f6',
  concentrado: '#8b5cf6',
  focused: '#8b5cf6',
  neutral: '#6b7280',
  cansado: '#f59e0b',
  tired: '#f59e0b',
  frustrado: '#ef4444',
  frustrated: '#ef4444',
  aburrido: '#eab308',
  bored: '#eab308',
};

function EmotionChart({ emotionData }) {
  if (!emotionData) return null;

  const labels = Object.keys(emotionData || {});
  const data = {
    labels,
    datasets: [
      {
        data: Object.values(emotionData || {}),
        backgroundColor: labels.map((emotion) => emotionColors[emotion?.toLowerCase()] || '#6b7280'),
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="h-64">
      <Doughnut data={data} options={chartOptions} />
    </div>
  );
}

function ProgressChart({ progressData }) {
  if (!progressData) return null;

  const labels = progressData?.labels || ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const data = {
    labels,
    datasets: [
      {
        label: 'Puntuación',
        data: progressData?.scores || [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  return (
    <div className="h-64">
      <Line data={data} options={chartOptions} />
    </div>
  );
}

export function DashboardCharts({ emotionData, progressData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card">
        <h3 className="section-title mb-4">Distribución de emociones</h3>
        <EmotionChart emotionData={emotionData} />
      </div>
      
      <div className="card">
        <h3 className="section-title mb-4">Progreso semanal</h3>
        <ProgressChart progressData={progressData} />
      </div>
    </div>
  );
}
