# 🚀 Guía de Despliegue - NeuroTeach

## 📋 Tabla de Contenidos
1. [Despliegue Local con Docker](#despliegue-local-con-docker)
2. [Despliegue en VPS/Servidor](#despliegue-en-vpsservidor)
3. [Despliegue en la Nube](#despliegue-en-la-nube)
4. [Variables de Entorno](#variables-de-entorno)
5. [Configuración de Base de Datos](#configuración-de-base-de-datos)
6. [SSL y Dominio](#ssl-y-dominio)
7. [Monitoreo y Logs](#monitoreo-y-logs)

---

## 🐳 Despliegue Local con Docker

### Paso 1: Preparar el entorno
```bash
# Clonar el repositorio
git clone https://github.com/alezzz23/NeuroTeach.git
cd NeuroTeach

# Verificar que Docker esté instalado
docker --version
docker-compose --version
```

### Paso 2: Configurar variables de entorno
```bash
# Crear archivo .env en back-end/neuro/
cp back-end/neuro/.env.example back-end/neuro/.env

# Editar las variables necesarias
# DATABASE_URL="postgresql://postgres:postgres123@postgres:5432/neuroteach"
# JWT_SECRET="tu-jwt-secret-muy-seguro"
# OPENAI_API_KEY="tu-openai-api-key"
```

### Paso 3: Ejecutar el despliegue
```bash
# Construir y ejecutar todos los servicios
docker-compose up --build -d

# Verificar que todos los servicios estén corriendo
docker-compose ps

# Ver logs si hay problemas
docker-compose logs -f
```

### Paso 4: Verificar el despliegue
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- Microservicio de emociones: http://localhost:5000

---

## 🖥️ Despliegue en VPS/Servidor

### Requisitos del servidor
- Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- 4GB RAM mínimo (8GB recomendado)
- 20GB espacio en disco
- Docker y Docker Compose instalados

### Paso 1: Preparar el servidor
```bash
# Conectar al servidor
ssh usuario@tu-servidor.com

# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Reiniciar sesión para aplicar cambios de grupo
exit
ssh usuario@tu-servidor.com
```

### Paso 2: Clonar y configurar el proyecto
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/NeuroTeach.git
cd NeuroTeach

# Crear archivo de producción
cp docker-compose.yml docker-compose.prod.yml
```

### Paso 3: Configurar variables de entorno de producción
```bash
# Crear archivo .env para producción
cat > back-end/neuro/.env << EOF
DATABASE_URL="postgresql://postgres:CONTRASEÑA_SEGURA@postgres:5432/neuroteach"
JWT_SECRET="jwt-secret-muy-seguro-para-produccion"
OPENAI_API_KEY="tu-openai-api-key"
NODE_ENV="production"
PORT=3000
EOF
```

### Paso 4: Modificar docker-compose para producción
```bash
# Editar docker-compose.prod.yml
nano docker-compose.prod.yml
```

Cambiar:
```yaml
# En el servicio postgres, cambiar la contraseña
POSTGRES_PASSWORD: CONTRASEÑA_SEGURA

# En el servicio backend, actualizar la DATABASE_URL
DATABASE_URL: "postgresql://postgres:CONTRASEÑA_SEGURA@postgres:5432/neuroteach"

# Agregar restart policies
restart: unless-stopped
```

### Paso 5: Ejecutar en producción
```bash
# Ejecutar en modo producción
docker-compose -f docker-compose.prod.yml up --build -d

# Verificar servicios
docker-compose -f docker-compose.prod.yml ps
```

### Paso 6: Configurar firewall
```bash
# Configurar UFW (Ubuntu)
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw allow 3001
sudo ufw allow 5000
sudo ufw enable
```

---

## ☁️ Despliegue en la Nube

### AWS EC2

#### Paso 1: Crear instancia EC2
1. Ir a AWS Console → EC2
2. Launch Instance
3. Seleccionar Ubuntu Server 22.04 LTS
4. Tipo de instancia: t3.medium (mínimo)
5. Configurar Security Group:
   - SSH (22): Tu IP
   - HTTP (80): 0.0.0.0/0
   - HTTPS (443): 0.0.0.0/0
   - Custom TCP (3000): 0.0.0.0/0
   - Custom TCP (3001): 0.0.0.0/0
   - Custom TCP (5000): 0.0.0.0/0

#### Paso 2: Configurar RDS (Base de datos)
1. Ir a RDS → Create Database
2. Seleccionar PostgreSQL
3. Configurar:
   - DB instance class: db.t3.micro
   - Storage: 20GB
   - Username: postgres
   - Password: [contraseña segura]
   - VPC: Mismo que EC2

#### Paso 3: Desplegar en EC2
```bash
# Conectar a la instancia
ssh -i tu-key.pem ubuntu@tu-ec2-ip

# Seguir pasos de "Despliegue en VPS/Servidor"
# Pero cambiar DATABASE_URL por la de RDS:
# DATABASE_URL="postgresql://postgres:password@tu-rds-endpoint:5432/neuroteach"
```

### Google Cloud Platform

#### Usando Cloud Run
```bash
# Instalar gcloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Configurar proyecto
gcloud config set project tu-proyecto-id

# Construir y subir imágenes
docker build -t gcr.io/tu-proyecto-id/neuroteach-backend ./back-end/neuro
docker build -t gcr.io/tu-proyecto-id/neuroteach-frontend ./frontend
docker build -t gcr.io/tu-proyecto-id/neuroteach-emotion ./python-emotion-service

docker push gcr.io/tu-proyecto-id/neuroteach-backend
docker push gcr.io/tu-proyecto-id/neuroteach-frontend
docker push gcr.io/tu-proyecto-id/neuroteach-emotion

# Desplegar servicios
gcloud run deploy neuroteach-backend --image gcr.io/tu-proyecto-id/neuroteach-backend --platform managed
gcloud run deploy neuroteach-frontend --image gcr.io/tu-proyecto-id/neuroteach-frontend --platform managed
gcloud run deploy neuroteach-emotion --image gcr.io/tu-proyecto-id/neuroteach-emotion --platform managed
```

---

## 🔧 Variables de Entorno

### Backend (.env)
```env
# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@host:5432/neuroteach"

# JWT
JWT_SECRET="tu-jwt-secret-muy-seguro"
JWT_EXPIRES_IN="7d"

# OpenAI
OPENAI_API_KEY="tu-openai-api-key"

# Servidor
PORT=3000
NODE_ENV="production"

# CORS
CORS_ORIGIN="http://tu-dominio.com,https://tu-dominio.com"

# Uploads
UPLOAD_PATH="./uploads"
MAX_FILE_SIZE=10485760

# Email (opcional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="tu-email@gmail.com"
SMTP_PASS="tu-app-password"
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://api.tu-dominio.com
REACT_APP_EMOTION_SERVICE_URL=https://emotion.tu-dominio.com
REACT_APP_ENVIRONMENT=production
```

---

## 🗄️ Configuración de Base de Datos

### PostgreSQL en producción
```bash
# Conectar a la base de datos
psql -h tu-host -U postgres -d neuroteach

# Crear usuario específico para la aplicación
CREATE USER neuroteach_user WITH PASSWORD 'contraseña_segura';
GRANT ALL PRIVILEGES ON DATABASE neuroteach TO neuroteach_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO neuroteach_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO neuroteach_user;
```

### Backup automático
```bash
# Crear script de backup
cat > /home/usuario/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/home/usuario/backups"
mkdir -p $BACKUP_DIR

docker exec neuroteach-postgres pg_dump -U postgres neuroteach > $BACKUP_DIR/neuroteach_$DATE.sql

# Mantener solo los últimos 7 backups
find $BACKUP_DIR -name "neuroteach_*.sql" -mtime +7 -delete
EOF

chmod +x /home/usuario/backup-db.sh

# Agregar a crontab (backup diario a las 2 AM)
crontab -e
# Agregar: 0 2 * * * /home/usuario/backup-db.sh
```

---

## 🔒 SSL y Dominio

### Configurar Nginx como proxy reverso
```bash
# Instalar Nginx
sudo apt install nginx -y

# Crear configuración
sudo nano /etc/nginx/sites-available/neuroteach
```

```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;
    
    # Redirigir a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tu-dominio.com www.tu-dominio.com;
    
    # Certificados SSL (se configurarán con Certbot)
    ssl_certificate /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;
    
    # Frontend
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Microservicio de emociones
    location /emotion/ {
        proxy_pass http://localhost:5000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/neuroteach /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Instalar Certbot para SSL
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Configurar renovación automática
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 📊 Monitoreo y Logs

### Configurar logs centralizados
```bash
# Crear directorio de logs
sudo mkdir -p /var/log/neuroteach

# Configurar logrotate
sudo nano /etc/logrotate.d/neuroteach
```

```
/var/log/neuroteach/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 root root
}
```

### Script de monitoreo
```bash
# Crear script de monitoreo
cat > /home/usuario/monitor.sh << 'EOF'
#!/bin/bash

# Verificar servicios Docker
services=("neuroteach-postgres" "neuroteach-backend" "neuroteach-frontend" "neuroteach-emotion-service")

for service in "${services[@]}"; do
    if ! docker ps | grep -q $service; then
        echo "$(date): $service is down, restarting..." >> /var/log/neuroteach/monitor.log
        docker-compose -f /home/usuario/NeuroTeach/docker-compose.prod.yml restart $service
    fi
done

# Verificar uso de disco
disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $disk_usage -gt 80 ]; then
    echo "$(date): Disk usage is ${disk_usage}%" >> /var/log/neuroteach/monitor.log
fi

# Verificar memoria
mem_usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ $mem_usage -gt 90 ]; then
    echo "$(date): Memory usage is ${mem_usage}%" >> /var/log/neuroteach/monitor.log
fi
EOF

chmod +x /home/usuario/monitor.sh

# Ejecutar cada 5 minutos
crontab -e
# Agregar: */5 * * * * /home/usuario/monitor.sh
```

### Comandos útiles para troubleshooting
```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend

# Ver uso de recursos
docker stats

# Reiniciar un servicio específico
docker-compose restart backend

# Verificar conectividad de base de datos
docker exec -it neuroteach-postgres psql -U postgres -d neuroteach -c "SELECT version();"

# Ver procesos en el servidor
htop

# Ver uso de disco
df -h

# Ver logs del sistema
sudo journalctl -f
```

---

## ✅ Checklist de Despliegue

### Pre-despliegue
- [ ] Servidor configurado con Docker
- [ ] Dominio apuntando al servidor
- [ ] Variables de entorno configuradas
- [ ] Base de datos creada
- [ ] Certificados SSL configurados

### Despliegue
- [ ] Código clonado en el servidor
- [ ] Docker Compose ejecutado
- [ ] Todos los servicios corriendo
- [ ] Migraciones de base de datos ejecutadas
- [ ] Frontend accesible
- [ ] API respondiendo
- [ ] Microservicio de emociones funcionando

### Post-despliegue
- [ ] Backup automático configurado
- [ ] Monitoreo configurado
- [ ] Logs centralizados
- [ ] Firewall configurado
- [ ] SSL funcionando
- [ ] Renovación automática de certificados

---

## 🆘 Solución de Problemas Comunes

### Error: "Cannot connect to database"
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps postgres

# Ver logs de PostgreSQL
docker-compose logs postgres

# Verificar variables de entorno
docker-compose exec backend env | grep DATABASE_URL
```

### Error: "Port already in use"
```bash
# Ver qué proceso usa el puerto
sudo netstat -tulpn | grep :3000

# Matar proceso si es necesario
sudo kill -9 PID
```

### Error: "Out of memory"
```bash
# Verificar memoria disponible
free -h

# Agregar swap si es necesario
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Error: "SSL certificate expired"
```bash
# Renovar certificado manualmente
sudo certbot renew

# Verificar configuración de renovación automática
sudo crontab -l | grep certbot
```