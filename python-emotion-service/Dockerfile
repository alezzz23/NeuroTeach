# Dockerfile para el microservicio Python de análisis de emociones
FROM python:3.10-slim

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libgthread-2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Establecer directorio de trabajo
WORKDIR /app

# Copiar requirements si existe, sino instalar dependencias directamente
COPY requirements.txt* ./

# Instalar dependencias Python
RUN pip install --no-cache-dir \
    tensorflow==2.13.0 \
    deepface \
    flask \
    flask-cors \
    opencv-python-headless \
    tf-keras

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 5000

# Comando para iniciar el servicio
CMD ["python", "emotion_service.py"]