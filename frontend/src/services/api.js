import { API_BASE_URL } from '../config';

const getAuthHeaders = () => {
  const stored = localStorage.getItem('user');
  if (!stored) return {};
  try {
    const parsed = JSON.parse(stored);
    const token = parsed.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
};

const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || 'Error en la solicitud');
  }
  return response.json();
};

export const authService = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    if (data.access_token) {
      localStorage.setItem('user', JSON.stringify(data));
    }
    return data;
  },

  register: async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await handleResponse(response);
    if (data.access_token) {
      localStorage.setItem('user', JSON.stringify(data));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('user');
  },
};

export const userService = {
  getUserById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },
};

export const historyService = {
  getHistory: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/history/${userId}`, {
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },

  createHistory: async (historyData) => {
    const response = await fetch(`${API_BASE_URL}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(historyData),
    });
    return handleResponse(response);
  },
};

export const analyticsService = {
  getOverview: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/analytics/overview/${userId}`, {
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },

  getEmotions: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/analytics/emotions/${userId}`, {
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },

  getProgress: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/analytics/progress/${userId}`, {
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },
};

export const gamificationService = {
  getUserGamification: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/gamification/user/${userId}`, {
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },

  addPoints: async (pointsData) => {
    const response = await fetch(`${API_BASE_URL}/gamification/points`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(pointsData),
    });
    return handleResponse(response);
  },

  updateStreak: async (streakData) => {
    const response = await fetch(`${API_BASE_URL}/gamification/streak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(streakData),
    });
    return handleResponse(response);
  },

  checkAchievements: async (achievementData) => {
    const response = await fetch(`${API_BASE_URL}/gamification/achievements/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(achievementData),
    });
    return handleResponse(response);
  },
};

export const tutorService = {
  ask: async (question, context = {}) => {
    const response = await fetch(`${API_BASE_URL}/tutor/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ question, ...context }),
    });
    return handleResponse(response);
  },
};

export const adaptationService = {
  getNextStep: async (userId, currentStep, performance) => {
    const response = await fetch(`${API_BASE_URL}/adaptation/next-step`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ userId, currentStep, performance }),
    });
    return handleResponse(response);
  },
};

export const learnService = {
  listTracks: async () => {
    const response = await fetch(`${API_BASE_URL}/learn/tracks`, {
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },

  listTracksWithProgress: async () => {
    const response = await fetch(`${API_BASE_URL}/learn/tracks-with-progress`, {
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },

  getDashboardSummary: async () => {
    const response = await fetch(`${API_BASE_URL}/learn/dashboard-summary`, {
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },

  getTrackBySlug: async (slug) => {
    const response = await fetch(`${API_BASE_URL}/learn/tracks/${encodeURIComponent(slug)}`, {
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },

  getTrackProgress: async (slug) => {
    const response = await fetch(`${API_BASE_URL}/learn/tracks/${encodeURIComponent(slug)}/progress`, {
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },

  getExerciseById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/learn/exercises/${id}`, {
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },

  getExerciseProgress: async (id) => {
    const response = await fetch(`${API_BASE_URL}/learn/exercises/${id}/progress`, {
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },

  saveExerciseProgress: async (id, progressData) => {
    const response = await fetch(`${API_BASE_URL}/learn/exercises/${id}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(progressData),
    });
    return handleResponse(response);
  },

  runExercise: async (id, code) => {
    const response = await fetch(`${API_BASE_URL}/learn/exercises/${id}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(typeof code === 'object' && code !== null ? code : { code }),
    });
    return handleResponse(response);
  },

  validateExercise: async (id, code) => {
    const response = await fetch(`${API_BASE_URL}/learn/exercises/${id}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(typeof code === 'object' && code !== null ? code : { code }),
    });
    return handleResponse(response);
  },
};
