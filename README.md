
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

## capturas servidores

- Servidor PythonFlask (el procesador de video)
  
<img width="971" height="489" alt="Servidor PythonFlask (el procesador de video)" src="https://github.com/user-attachments/assets/9891374d-91e0-4777-ab1b-6a46a44de9ca" />

- Servidor Node.js (el backend de la webapp)

<img width="964" height="472" alt="Servidor Node js (el backend de la webapp)" src="https://github.com/user-attachments/assets/680d9c17-7df3-4894-bc57-c15a17d49646" />

- Servidor de desarrollo de React (el frontend)

<img width="962" height="467" alt="Servidor de desarrollo de React (el frontend)" src="https://github.com/user-attachments/assets/ec1c43ed-874a-4374-b11c-8e40ca0093d9" />
