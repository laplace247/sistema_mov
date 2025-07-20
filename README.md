
## guia de la aplicacion

1. **client (carpeta que contiene el frontend)**
2. **server (carpeta que contiene el backend)**
3. **database (archivo .db sqlite)**

---

para iniciar el server
```bash
cd server
node server.mjs
```
para iniciar el cliente

```bash
cd client
npm run dev
```
para correar el directo
```bash
python video_processor.py
```
---
```
/PRACTICA5
│
├── client/             # React frontend
│   └── src/components/
│
├── server/             # Node.js + Express backend
│   ├── routes/
│   ├── config/
│   ├── sockets/        # lógica WebSocket
│   └── recordings/     # donde se guardan los clips
│
├── database/           # sqlite
└── .env                # configs (puerto, DB, JWT)
```

