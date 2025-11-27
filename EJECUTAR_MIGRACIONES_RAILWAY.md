# 🗄️ Ejecutar Migraciones en Railway

## Pasos para ejecutar las migraciones SQL

### 1. Acceder a PostgreSQL en Railway

1. Ve a tu proyecto en Railway: https://railway.com/project/e256cf98-0825-42d0-bb84-cee9ec375814
2. Click en el servicio **PostgreSQL**
3. Ve a la pestaña **"Data"** o **"Query"**

### 2. Ejecutar el SQL

Copia y pega el siguiente SQL completo en el editor de queries de Railway:

```sql
-- Tabla de reacciones
CREATE TABLE IF NOT EXISTS reactions (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    book_unique_id VARCHAR(255) NOT NULL,
    target_type VARCHAR(20) NOT NULL,
    chapter_index INTEGER,
    page_number INTEGER,
    timestamp_position BIGINT,
    quote_id BIGINT,
    emoji VARCHAR(10) NOT NULL,
    predefined_message_id INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, book_unique_id, target_type, 
           COALESCE(chapter_index, -1), 
           COALESCE(page_number, -1), 
           COALESCE(timestamp_position, -1), 
           COALESCE(quote_id, -1))
);

-- Tabla de citas
CREATE TABLE IF NOT EXISTS quotes (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    book_unique_id VARCHAR(255) NOT NULL,
    chapter_index INTEGER NOT NULL,
    text_fragment TEXT NOT NULL,
    position_start INTEGER NOT NULL,
    position_end INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de perfiles anónimos
CREATE TABLE IF NOT EXISTS profiles (
    user_id VARCHAR(64) PRIMARY KEY,
    display_name VARCHAR(100),
    books_read TEXT[],
    books_completed TEXT[],
    share_gamification BOOLEAN DEFAULT false,
    share_reading_progress BOOLEAN DEFAULT false,
    share_reactions BOOLEAN DEFAULT true,
    last_active_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de estadísticas comunitarias (cache)
CREATE TABLE IF NOT EXISTS book_community_stats (
    book_unique_id VARCHAR(255) PRIMARY KEY,
    total_readers INTEGER NOT NULL DEFAULT 0,
    currently_reading INTEGER NOT NULL DEFAULT 0,
    total_completed INTEGER NOT NULL DEFAULT 0,
    total_reactions INTEGER NOT NULL DEFAULT 0,
    reactions_by_emoji JSONB DEFAULT '{}',
    chapter_reactions JSONB DEFAULT '{}',
    page_reactions JSONB DEFAULT '{}',
    timestamp_reactions JSONB DEFAULT '{}',
    top_quotes BIGINT[] DEFAULT '{}',
    top_pages INTEGER[] DEFAULT '{}',
    top_timestamps BIGINT[] DEFAULT '{}',
    last_updated TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_reactions_book ON reactions(book_unique_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user ON reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_reactions_target ON reactions(book_unique_id, target_type);
CREATE INDEX IF NOT EXISTS idx_quotes_book ON quotes(book_unique_id);
CREATE INDEX IF NOT EXISTS idx_quotes_user ON quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON profiles(display_name) WHERE display_name IS NOT NULL;
```

### 3. Verificar

Después de ejecutar, deberías ver:
- ✅ 4 tablas creadas: `reactions`, `quotes`, `profiles`, `book_community_stats`
- ✅ 6 índices creados

### 4. Verificar que el backend esté deployado

1. En Railway, ve a tu servicio **backend** (el que tiene el código Node.js)
2. Verifica que esté en estado **"ONLINE"** o **"DEPLOYED"**
3. Ve a **Settings** → **Domains**
4. Copia la URL (ej: `https://tu-app.railway.app`)

### 5. Probar el health check

Abre en el navegador: `https://tu-url.railway.app/health`

Deberías ver:
```json
{"success":true,"message":"API is running"}
```

---

## ✅ Checklist

- [ ] Migraciones SQL ejecutadas
- [ ] Backend deployado y ONLINE
- [ ] URL del backend obtenida
- [ ] Health check funcionando

Cuando completes estos pasos, avísame y configuramos la app Android para usar el backend.

