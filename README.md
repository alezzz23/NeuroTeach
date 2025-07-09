# NeuroTeach

Plataforma de aprendizaje adaptativo con IA que personaliza contenido educativo en tiempo real usando emociones (análisis facial/webcam) y rendimiento cognitivo.

## 🚀 Descripción
NeuroTeach es una plataforma innovadora que utiliza affective computing y modelos de lenguaje avanzados para adaptar el contenido educativo según el estado emocional y el rendimiento cognitivo del usuario. El sistema detecta emociones a través de la webcam y ajusta las explicaciones y la dificultad en tiempo real, mejorando la experiencia y el aprendizaje.

## 🧠 Core Innovador
- **Affective Computing:** Detección de emociones (aburrimiento, confusión, frustración) vía webcam.
- **OpenAI + Llama:** Generación de explicaciones alternativas según el estado emocional.
- **Análisis de patrones:** Predicción de puntos de quiebre en el aprendizaje usando regresión bayesiana.

## ⚙️ Stack Técnico
- **Backend:** NestJS (TypeScript), PostgreSQL, integración con OpenAI/Llama, mock de análisis emocional.
- **Frontend:** React, TensorFlow.js, Three.js, react-webcam.
- **Otros:** Neo4j (grafo de conocimiento), Algoritmos genéticos.

## 📊 MVP Sencillo
- API para análisis de emociones (mock inicial)
- Conexión a OpenAI/Llama API
- Almacenamiento de historial de aprendizaje en PostgreSQL
- Frontend con webcam, chat IA emocional, dashboard de progreso

## 📁 Estructura Propuesta

```
neuroteach/
│
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── emotion/
│   │   │   ├── tutor/
│   │   │   ├── user/
│   │   │   └── history/
│   │   ├── main.ts
│   │   └── app.module.ts
│   ├── test/
│   ├── prisma/
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WebcamCapture.tsx
│   │   │   ├── ChatTutor.tsx
│   │   │   ├── ProgressDashboard.tsx
│   │   │   └── ThreeDAnimation.tsx
│   │   ├── pages/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── docs/
│   ├── architecture.md
│   └── mvp.md
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

## ✨ Features Clave
- Tutor de IA emocional
- Mapa mental interactivo
- Rutas de aprendizaje personalizadas
- Neuro-feedback
- Modo colaborativo con IA

---

> _¿Listo para empezar? Puedes modificar este README según evolucione el proyecto._ 