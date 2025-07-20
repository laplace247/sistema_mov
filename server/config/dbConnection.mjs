// server/dbConnection.mjs
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Para resolver __dirname con ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta absoluta al archivo de base de datos
const dbPath = path.resolve(__dirname, '../../database/security_system.db');

// Conexión a la base de datos física
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos SQLite:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
  }
});

// Habilitar claves foráneas
db.run('PRAGMA foreign_keys = ON');

export default db;
