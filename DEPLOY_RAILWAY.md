# 🚂 Guía Rápida: Deploy en Railway

## ✅ Paso 1: Repositorio Git (COMPLETADO)
- ✅ Repositorio inicializado
- ✅ Archivos añadidos
- ✅ Commit realizado

## 📤 Paso 2: Crear Repositorio en GitHub

### Opción A: Desde GitHub Web (Más Fácil)

1. Ve a https://github.com/new
2. Nombre del repositorio: `ttsreader-backend` (o el que prefieras)
3. Descripción: "Backend API para sistema social de TTSReader"
4. **NO marques** "Add a README file" (ya tenemos uno)
5. **NO marques** "Add .gitignore" (ya tenemos uno)
6. Click en "Create repository"

### Opción B: Desde Terminal (Si tienes GitHub CLI)

```bash
gh repo create ttsreader-backend --public --source=. --remote=origin --push
```

## 🔗 Paso 3: Conectar y Subir Código

Una vez creado el repositorio en GitHub, ejecuta estos comandos:

```bash
cd backend
git remote add origin https://github.com/TU-USUARIO/ttsreader-backend.git
git push -u origin main
```

**Nota:** Reemplaza `TU-USUARIO` con tu nombre de usuario de GitHub.

## 🚂 Paso 4: Deploy en Railway

Una vez subido a GitHub:

1. Ve a https://railway.app
2. Inicia sesión con GitHub
3. Click "New Project"
4. Selecciona "Deploy from GitHub repo"
5. Elige tu repositorio `ttsreader-backend`
6. Railway detectará automáticamente Node.js y empezará el deploy

## 📊 Paso 5: Crear PostgreSQL

1. En Railway, dentro de tu proyecto
2. Click "New" → "Database" → "PostgreSQL"
3. Railway crea automáticamente la base de datos
4. La variable `DATABASE_URL` se configura automáticamente

## 🗄️ Paso 6: Ejecutar Migraciones

1. En Railway, ve a tu servicio PostgreSQL
2. Click en "Data" → "Query"
3. Abre el archivo `src/db/migrations/001_initial_schema.sql`
4. Copia todo el contenido
5. Pégalo en el editor de queries de Railway
6. Click "Run" o ejecuta la query

## ✅ Paso 7: Verificar Deploy

1. En Railway, ve a tu servicio backend
2. Click en "Settings" → "Domains"
3. Copia la URL (ej: `https://tu-app.railway.app`)
4. Prueba el health check:
   ```bash
   curl https://tu-app.railway.app/health
   ```

## 🔧 Paso 8: Configurar en la App

En tu app Android, configura la URL:

```kotlin
val syncService = CommunitySyncService(context)
syncService.setBackendUrl("https://tu-app.railway.app")
```

---

## 🆘 Si algo falla

- **Error de conexión a BD:** Verifica que `DATABASE_URL` esté configurada
- **Error en migraciones:** Ejecuta el SQL manualmente desde Railway
- **Deploy falla:** Revisa los logs en Railway → Deployments → View Logs

