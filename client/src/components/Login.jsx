import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const API_URL = 'http://localhost:3000/api';

export default function Login() {
  const navigate = useNavigate(); // <-- aquí va
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberUser');
    if (savedUsername) {
      setUsername(savedUsername);
      setRemember(true);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    setError('');
    if (!username.trim() || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (remember) {
          localStorage.setItem('userData', JSON.stringify(data.user));
          localStorage.setItem('rememberUser', username.trim());
        } else {
          sessionStorage.setItem('userData', JSON.stringify(data.user));
          localStorage.removeItem('rememberUser');
          localStorage.removeItem('userData');
        }

        setLoggedUser(data.user);

        // Redirigir luego de 2 segundos
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(data.message || 'Error al iniciar sesión');
        setPassword('');
      }
    } catch {
      setError('Error de conexión. Verifica que el servidor esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  };

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  if (loggedUser) {
    return (
      <div className="login-container"> 
        <div className="login-box">
          <div className="login-header">
            <h2>¡Bienvenido, {loggedUser.fullName || loggedUser.username}!</h2>
            <p>Inicio de sesión exitoso</p>
          </div>
          <div className="register-link" style={{ textAlign: 'center', margin: '20px 0' }}>
            Redireccionando al panel de administración...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h2>Iniciar sesión</h2>
          <p>Ingrese las credenciales para acceder</p>
        </div>

        <div className={`login-form ${error ? 'shake' : ''}`}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              placeholder="Ingresa tu nombre de usuario"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={onKeyPress}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={onKeyPress}
              />
              <span className="toggle-password" onClick={togglePasswordVisibility} style={{ userSelect: 'none' }}>
                {showPassword ? '◎' : '◉'}
              </span>
            </div>
          </div>

          <div className="form-group remember-me">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={() => setRemember(!remember)}
            />
            <label htmlFor="remember">Recordar sesión</label>
          </div>

          <button
            id="login-button"
            className="login-button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>

          <div className="register-link">
            ¿Es tu primera vez? <a href="/signup">Regístrate</a>
          </div>
        </div>
      </div>
    </div>
  );
}
