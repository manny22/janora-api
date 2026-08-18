# Configuración de Ambientes - Janora API

## Descripción General

El proyecto está configurado para soportar múltiples ambientes (development, staging, production) con variables de entorno específicas para cada uno.

## Estructura de Archivos `.env`

```
.env                   # Variables por defecto
.env.development       # Ambiente de desarrollo
.env.staging          # Ambiente de staging
.env.production       # Ambiente de producción
```

## Variables de Configuración

### Base de Datos

- `DB_HOST`: Host de la base de datos PostgreSQL
- `DB_PORT`: Puerto de PostgreSQL (default: 5432)
- `DB_USERNAME`: Usuario de la base de datos
- `DB_PASSWORD`: Contraseña de la base de datos
- `DB_NAME`: Nombre de la base de datos

### JWT

- `JWT_SECRET`: Clave secreta para JWT
- `JWT_EXPIRES_IN`: Tiempo de expiración del JWT (default: 15m)
- `JWT_REFRESH_SECRET`: Clave secreta para refresh tokens
- `JWT_REFRESH_EXPIRES_IN`: Tiempo de expiración del refresh token (default: 7d)

### Aplicación

- `NODE_ENV`: Ambiente (development, staging, production)
- `PORT`: Puerto de la aplicación (default: 3000)
- `CORS_ORIGIN`: Origen permitido para CORS

## Comandos por Ambiente

### Desarrollo

```bash
npm run start:dev
```
Inicia la aplicación en modo watch usando `.env.development`

### Staging

```bash
npm run start:staging
```
Inicia la aplicación en modo watch usando `.env.staging`

### Producción

```bash
npm run build
npm run start:prod
```
Compila y ejecuta la aplicación usando `.env.production`

## Migraciones de Base de Datos

### Desarrollo

```bash
npm run prisma:migrate
```

### Staging

```bash
npm run prisma:migrate:staging
```

### Producción

```bash
npm run prisma:migrate:prod
```

## Cambiar la Base de Datos

Para conectarte a una base de datos real:

1. **Edita el archivo `.env` correspondiente:**
   ```env
   DB_HOST=192.168.78.188
   DB_PORT=5432
   DB_USERNAME=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=tu_base_datos
   ```

2. **Ejecuta las migraciones:**
   ```bash
   npm run prisma:migrate
   ```

3. **Inicia la aplicación:**
   ```bash
   npm run start:dev
   ```

## Configuración Actual (Desarrollo)

- **Host**: 192.168.78.188
- **Puerto**: 5432
- **Base de Datos**: janora_db
- **Usuario**: janora_user

## Notas de Seguridad

⚠️ **IMPORTANTE**: 
- Nunca commitear credenciales reales en los archivos `.env`
- Los archivos `.env` están en `.gitignore`
- Para producción, utilizar variables de entorno del sistema o secrets manager
- Cambiar todas las claves secretas en `JWT_SECRET` y `JWT_REFRESH_SECRET` en producción
