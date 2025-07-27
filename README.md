# NeuroTeach

## 🚦 Instalación y Puesta en Marcha

### Requisitos previos
- Node.js >= 18.x y npm
- PostgreSQL (ejecutándose localmente o en la nube)
- **Python 3.10** (recomendado para DeepFace)

---

### 1. Clona el repositorio
```bash
git clone https://github.com/tu-usuario/NeuroTeach.git
cd NeuroTeach
```

---

### 2. Backend (NestJS)
```bash
cd back-end/neuro
npm install
```

#### Configura las variables de entorno

Ya existe un archivo `.env` en `back-end/neuro/` (o un archivo `.env.example`). Solo edítalo para ajustar los valores según tu entorno:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/neuroteach"
```

No es necesario crear el archivo desde cero, solo personaliza los datos de conexión a tu base de datos PostgreSQL.

#### Inicializa la base de datos (Prisma)
```bash
npx prisma migrate deploy
# o para desarrollo:
npx prisma migrate dev
```

#### Inicia el backend
```bash
npm run start:dev
```
El backend estará disponible en `http://localhost:3000` (o el puerto configurado).

---

### 3. Microservicio Python (DeepFace)

#### Requisitos:
- **Python 3.10** (no usar 3.12+)
    
#### Instala las dependencias:
```bash
pip install tensorflow
pip install deepface flask flask-cors opencv-python tf-keras
```

#### Ejecuta el microservicio:
```bash
python emotion_service.py
```
El microservicio estará disponible en `http://localhost:5000/analyze`

---

### 4. Frontend (React)
En otra terminal:
```bash
cd frontend
npm install
npm start
```
El frontend estará disponible en `http://localhost:3001`

---

## 🐳 Instalación con Docker (Recomendado)

### Requisitos previos
- Docker y Docker Compose instalados

### Ejecutar con Docker
```bash
# Clona el repositorio
git clone https://github.com/alezzz23/NeuroTeach.git
cd NeuroTeach

# Construir y ejecutar todos los servicios
docker-compose up --build

# O ejecutar en segundo plano
docker-compose up -d --build
```

### Servicios disponibles
- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3000
- **Microservicio de emociones:** http://localhost:5000
- **PostgreSQL:** localhost:5432

### Comandos útiles de Docker
```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Reconstruir un servicio específico
docker-compose up --build backend
```

### Desarrollo con Docker
Para desarrollo con hot reload y debugging:

```bash
# Usar el archivo de desarrollo
docker-compose -f docker-compose.dev.yml up --build

# Solo servicios específicos
docker-compose -f docker-compose.dev.yml up backend frontend

# Con logs en tiempo real
docker-compose -f docker-compose.dev.yml up --build -f
```

**Características del entorno de desarrollo:**
- Hot reload automático para frontend y backend
- Volúmenes montados para cambios en tiempo real
- Puerto de debugging habilitado para el backend (9229)
- Variables de entorno optimizadas para desarrollo

### 🚀 Despliegue en Producción
Para instrucciones detalladas de despliegue en servidores y la nube, consulta la [Guía de Despliegue](./DEPLOYMENT.md).

---

## 🧩 Instalación Manual (Alternativa)

### Flujo de arranque recomendado
1. **Inicia PostgreSQL** (si es local).
2. **Ejecuta migraciones Prisma** en el backend.
3. **Arranca el microservicio Python** (`python emotion_service.py`).
4. **Arranca el backend** (`npm run start:dev` en `back-end/neuro`).
5. **Arranca el frontend** (`npm start` en `frontend`).

---

## 📝 Notas importantes

### Con Docker:
- Todos los servicios se configuran automáticamente con las dependencias correctas.
- La base de datos PostgreSQL se inicializa automáticamente.
- Las migraciones de Prisma se ejecutan automáticamente al iniciar el backend.
- Los puertos están mapeados para evitar conflictos.

### Instalación manual:
- Si tienes problemas con TensorFlow/DeepFace, revisa la versión de Python (usa 3.10).
- Si algún puerto está ocupado, puedes cambiarlo en la configuración del backend o frontend.
- El backend se comunica con el microservicio Python por HTTP (`http://localhost:5000/analyze`).
- El frontend se comunica con el backend por REST y WebSocket (`http://localhost:3000`).
- El frontend corre en el puerto 3001 para evitar conflictos con el backend.

---

## 🚀 Descripción
NeuroTeach es una plataforma innovadora que utiliza affective computing y modelos de lenguaje avanzados para adaptar el contenido educativo según el estado emocional y el rendimiento cognitivo del usuario. El sistema detecta emociones a través de la webcam y ajusta las explicaciones y la dificultad en tiempo real, mejorando la experiencia y el aprendizaje.

## 🧠 Core Innovador
- **Affective Computing:** Detección de emociones (aburrimiento, confusión, frustración) vía webcam.
- **OpenAI + Llama:** Generación de explicaciones alternativas según el estado emocional.
- **Análisis de patrones:** Predicción de puntos de quiebre en el aprendizaje usando regresión bayesiana.

## ⚙️ Stack Técnico
- **Backend:** NestJS (TypeScript), PostgreSQL, integración con OpenAI/Llama, análisis emocional vía microservicio Python (DeepFace).
- **Frontend:** React, TensorFlow.js, Three.js, react-webcam.
- **Otros:** Neo4j (grafo de conocimiento), Algoritmos genéticos.

## 📊 MVP Sencillo
- API para análisis de emociones (DeepFace vía microservicio Python)
- Conexión a OpenAI/Llama API
- Almacenamiento de historial de aprendizaje en PostgreSQL
- Frontend con webcam, chat IA emocional, dashboard de progreso

## 📁 Estructura Propuesta

```
NeuroTeach/
│
├── back-end/
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
│   │   │   ├── WebcamCapture.js
│   │   │   ├── ChatTutor.js
│   │   │   ├── ProgressDashboard.js
│   │   │   └── ThreeDAnimation.js
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── python-emotion-service/
│   └── emotion_service.py
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
