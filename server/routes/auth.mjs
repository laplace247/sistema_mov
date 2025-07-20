import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/dbConnection.mjs';

const router = express.Router();
const SECRET = 'Y8m$9f^Rg!T7z&XqLp2#VuDjN@KsWbE4HZF%oCxa13MhIy6et0nPwS'; // Cambia esto en producción

// Middleware para validar token JWT en rutas protegidas
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user; // Guardamos la info del token para la ruta
    next();
  });
}

// Login que devuelve JWT
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Faltan campos.' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error DB.' });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos.' });
    }

    db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?', [user.user_id]);

    // Crear token JWT
    const token = jwt.sign(
      { userId: user.user_id, username: user.username, role: user.role },
      SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      token,
      user: {
        userId: user.user_id,
        username: user.username,
        role: user.role,
        fullName: user.full_name,
        email: user.email
      }
    });
  });
});

// Ruta protegida de ejemplo
router.get('/profile', authenticateToken, (req, res) => {
  // req.user tiene info del token
  res.json({ message: `Perfil de usuario ${req.user.username}`, user: req.user });
});

export default router;
