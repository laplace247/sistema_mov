# Sistema de Vigilancia Inteligente con ESP32-CAM

Este proyecto implementa una solución de seguridad que integra:

- **Frontend:** SPA en React para visualización, administración y monitoreo.
- **Backend:** Node.js + Express para API REST, autenticación JWT y gestión de usuarios/dispositivos/eventos.
- **Procesador de video:** Python (Flask + OpenCV) para streaming MJPEG, detección de movimiento y registro de eventos en la base de datos.
- **Base de datos:** SQLite3 para almacenar usuarios, dispositivos, eventos, grabaciones y notificaciones.

---

## Estructura del proyecto

```
/PRACTICA5
│
├── client/             # Frontend React
│   ├── src/components/ # Componentes principales
│   └── ...             # Otros archivos y assets
│
├── server/             # Backend Node.js + Express
│   ├── routes/         # Rutas API (auth, etc.)
│   ├── config/         # Configuración DB
│   ├── sockets/        # WebSocket (alertas en tiempo real)
│   └── recordings/     # Carpeta para clips grabados
│
├── database/           # SQLite3 (.db, esquema y datos)
│   ├── schema.sql      # Estructura de tablas
│   ├── data.sql        # Datos iniciales
│   └── security_system.db
│
├── video_processor.py  # Procesador de video (Flask + OpenCV)
├── run_all.bat         # Script para iniciar todos los servicios
└── .env                # Configuración de entorno (puertos, claves)
```

---

## Cómo iniciar los servicios

1. **Backend (Node.js + Express):**
   ```bash
   cd server
   node server.mjs
   ```

2. **Frontend (React):**
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Procesador de video (Python + Flask):**
   ```bash
   python video_processor.py
   ```

4. **Script para iniciar todo (Windows):**
   ```bash
   run_all.bat
   ```

---

## Funcionalidades principales

- **Streaming en vivo:** Visualización MJPEG desde la cámara (ESP32-CAM o webcam).
- **Detección y grabación de movimiento:** Procesamiento en tiempo real, registro de eventos en la base de datos.
- **Autenticación y gestión de usuarios:** Registro, login y control de acceso con JWT.
- **Historial de grabaciones y eventos:** Consulta y descarga de clips y registros desde la web.
- **Notificaciones:** Soporte para alertas y preferencias de usuario.
- **Panel de administración:** Dashboard para gestión de dispositivos, usuarios y eventos.

---

## Capturas de los servidores

- **Servidor PythonFlask (procesador de video):**

  

- **Servidor Node.js (backend webapp):**

  

- **Servidor de desarrollo de React (frontend):**

  

---

## Requisitos

- Node.js >= 18.x
- Python >= 3.8
- SQLite3

---

## Notas

- El sistema está pensado para funcionar en red local, sin necesidad de Internet.
- Puedes adaptar la integración con ESP32-CAM según tu hardware y red.
- Para producción, asegúrate de cambiar las claves JWT y configurar variables de entorno seguras.