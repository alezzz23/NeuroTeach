import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

function AnalyticsCharts({ emotionData, progressData }) {
  if (!emotionData || !progressData || !emotionData.distribution || !progressData.weeklyProgress || !progressData.topicProgress) {
    return (
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="loading-skeleton chart-skeleton"></div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="loading-skeleton chart-skeleton"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Configuración del gráfico de emociones
  const emotionChartData = {
    labels: Object.keys(emotionData.distribution || {}),
    datasets: [
      {
        data: Object.values(emotionData.distribution || {}),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const emotionChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Distribución de Emociones',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
  };

  // Configuración del gráfico de progreso semanal
  const progressChartData = {
    labels: (progressData.weeklyProgress || []).map(item => item.week),
    datasets: [
      {
        label: 'Sesiones',
        data: (progressData.weeklyProgress || []).map(item => item.sessions),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
      },
      {
        label: 'Puntuación Promedio',
        data: (progressData.weeklyProgress || []).map(item => item.averageScore),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        yAxisID: 'y1',
      },
    ],
  };

  const progressChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Semana',
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Sesiones',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Puntuación (%)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Progreso Semanal',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
  };

  // Configuración del gráfico de progreso por tema
  const topicChartData = {
    labels: (progressData.topicProgress || []).map(item => item.topic),
    datasets: [
      {
        label: 'Puntuación Promedio',
        data: (progressData.topicProgress || []).map(item => item.averageScore),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  const topicChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Rendimiento por Tema',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Puntuación (%)',
        },
      },
    },
  };

  return (
    <div className="row g-3">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <Doughnut data={emotionChartData} options={emotionChartOptions} />
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <Line data={progressChartData} options={progressChartOptions} />
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <Bar data={topicChartData} options={topicChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsCharts;