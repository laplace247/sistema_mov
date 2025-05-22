// server.js - Servidor básico para la conexión con PostgreSQL

const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de middleware
app.use(cors());                             // Habilitar CORS
app.use(express.json());                     // Parsear solicitudes JSON
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos

// Configuración de conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',           // Cambia esto a tu usuario de PostgreSQL
  host: 'localhost',          // Host de tu base de datos
  database: 'security_system', // Nombre de tu base de datos
  password: 'gatito',       // Cambia esto a tu contraseña de PostgreSQL
  port: 5432,                 // Puerto por defecto de PostgreSQL
});

// Probar conexión a la base de datos
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error conectando a PostgreSQL:', err);
  } else {
    console.log('Conectado a PostgreSQL:', res.rows[0]);
  }
});

// Ruta para el login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validar que se proporcionaron ambos campos
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Por favor, completa todos los campos.' 
      });
    }
    
    // Buscar usuario en la base de datos
    const userQuery = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    const user = userQuery.rows[0];
    
    // Si no se encuentra el usuario
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos.'
      });
    }
    
    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos.'
      });
    }
    
    // Actualizar última conexión
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1',
      [user.user_id]
    );
    
    // Enviar respuesta exitosa
    res.json({
      success: true,
      user: {
        userId: user.user_id,
        username: user.username,
        role: user.role,
        fullName: user.full_name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor. Inténtalo más tarde.'
    });
  }
});

// Ruta para crear usuarios de prueba (solo para desarrollo)
app.post('/api/setup-test-users', async (req, res) => {
  try {
    // Verificar si ya existen usuarios
    const checkUsers = await pool.query('SELECT COUNT(*) FROM users');
    
    if (parseInt(checkUsers.rows[0].count) > 0) {
      return res.json({ 
        success: false,
        message: 'Ya existen usuarios en la base de datos'
      });
    }
    
    // Hash de contraseñas
    const adminPassword = await bcrypt.hash('admin123', 10);
    const superadminPassword = await bcrypt.hash('super123', 10);
    
    // Crear usuarios
    await pool.query(`
      INSERT INTO users (username, password, email, role, is_active)
      VALUES 
        ('admin', $1, 'admin@example.com', 'admin', true),
        ('superadmin', $2, 'superadmin@example.com', 'admin', true)
    `, [adminPassword, superadminPassword]);
    
    return res.json({
      success: true,
      message: 'Usuarios de prueba creados exitosamente'
    });
  } catch (error) {
    console.error('Error creando usuarios de prueba:', error);
    res.status(500).json({
      success: false,
      message: 'Error creando usuarios de prueba'
    });
  }
});

// Ruta para verificar estado del servidor
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online',
    message: 'Servidor funcionando correctamente'
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});