# 🚀 TTSReader Social Backend

Backend API para el sistema social de TTSReader. Implementado con Node.js + Express + PostgreSQL.

## 📋 Características

- ✅ Sincronización de reacciones
- ✅ Sincronización de citas
- ✅ Estadísticas comunitarias agregadas
- ✅ Validación de nombres de usuario
- ✅ Recomendaciones (pendiente implementar algoritmo)

## 🛠️ Setup Local

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Copia `.env.example` a `.env` y configura:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/ttsreader_social
```

### 3. Crear base de datos
```bash
createdb ttsreader_social
```

### 4. Ejecutar migraciones
```bash
psql -d ttsreader_social -f src/db/migrations/001_initial_schema.sql
```

### 5. Iniciar servidor
```bash
npm start
# o para desarrollo con auto-reload:
npm run dev
```

## 🚂 Deploy en Railway

### Paso 1: Subir a GitHub
1. Inicializar repositorio:
   ```bash
   git init
   git add .
   git commit -m "Initial backend setup"
   ```

2. Crear repositorio en GitHub y subir:
   ```bash
   git remote add origin https://github.com/tu-usuario/ttsreader-backend.git
   git push -u origin main
   ```

### Paso 2: Setup en Railway
1. Ve a https://railway.app
2. Inicia sesión con GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Selecciona tu repositorio

### Paso 3: Crear PostgreSQL
1. En Railway, click "New" → "Database" → "PostgreSQL"
2. Railway crea automáticamente la base de datos y la variable `DATABASE_URL`

### Paso 4: Ejecutar migraciones
1. En Railway, ve a tu servicio PostgreSQL
2. Click en "Data" → "Query"
3. Copia y pega el contenido de `src/db/migrations/001_initial_schema.sql`
4. Ejecuta el script

### Paso 5: Configurar variables de entorno
1. En tu servicio backend, ve a "Variables"
2. Railway ya tiene `DATABASE_URL` automáticamente
3. Añade si es necesario:
   - `PORT=3000` (Railway lo asigna automáticamente)
   - `NODE_ENV=production`

### Paso 6: Deploy
Railway deploya automáticamente al hacer push a GitHub. O puedes hacer deploy manual desde el dashboard.

### Paso 7: Obtener URL
1. En Railway, ve a tu servicio backend
2. Click en "Settings" → "Domains"
3. Copia la URL (ej: `https://tu-app.railway.app`)

## 🔗 Configurar en la App Android

En tu app, configura la URL del backend:

```kotlin
val syncService = CommunitySyncService(context)
syncService.setBackendUrl("https://tu-app.railway.app")
```

## 📡 Endpoints

### Health Check
- **GET** `/health` - Verificar que el servidor está funcionando

### Reacciones
- **POST** `/api/reactions` - Crear o actualizar reacción

### Citas
- **POST** `/api/quotes` - Crear cita

### Estadísticas
- **GET** `/api/stats/:bookUniqueId` - Obtener estadísticas comunitarias

### Username
- **POST** `/api/username/check` - Verificar disponibilidad de nombre

### Recomendaciones
- **GET** `/api/recommendations/:userId` - Obtener recomendaciones (pendiente)

## 🧪 Pruebas

### Health Check
```bash
curl https://tu-app.railway.app/health
```

### Crear Reacción
```bash
curl -X POST https://tu-app.railway.app/api/reactions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test123",
    "bookUniqueId": "isbn:1234567890",
    "targetType": "CHAPTER",
    "chapterIndex": 1,
    "emoji": "🔥",
    "timestamp": 1706284800000
  }'
```

### Obtener Estadísticas
```bash
curl https://tu-app.railway.app/api/stats/isbn:1234567890
```

## 📝 Notas

- Las estadísticas se calculan automáticamente cuando se crea/actualiza una reacción o cita
- El cache de estadísticas se actualiza en tiempo real
- PostgreSQL se conecta automáticamente en Railway mediante `DATABASE_URL`

