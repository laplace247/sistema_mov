// server/server.mjs
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.mjs';

// Resolver __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear app
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Rutas
app.use('/api', authRoutes);

// Ruta de estado
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', message: 'Servidor funcionando con SQLite' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor SQLite corriendo en http://localhost:${PORT}`);
});
