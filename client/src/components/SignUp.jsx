import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SignUp.css';

const API_URL = 'http://localhost:3000/api';

export default function Signup() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword, fullName } = formData;
    
    if (!username.trim() || !email.trim() || !password || !confirmPassword || !fullName.trim()) {
      setError('Por favor, completa todos los campos.');
      return false;
    }

    if (username.length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, ingresa un email válido.');
      return false;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
          fullName: formData.fullName.trim()
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setError(data.message || 'Error al crear la cuenta');
      }
    } catch (error) {
      setError('Error de conexión. Verifica que el servidor esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  };

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignup();
    }
  };

  if (success) {
    return (
      <div className="signup-container">
        <div className="signup-box success-state">
          <div className="signup-header">
            <h2>¡Cuenta creada exitosamente!</h2>
            <p>Bienvenido, {formData.fullName}</p>
          </div>
          <div className="success-redirect">
            <div className="loading-spinner"></div>
            Redireccionando al inicio de sesión<span className="loading-dots"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-header">
          <h2>Crear cuenta</h2>
          <p>Completa los datos para registrarte</p>
        </div>

        <div className={`signup-form ${error ? 'shake' : ''}`}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="fullName">Nombre completo</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Ingresa tu nombre completo"
              autoComplete="name"
              value={formData.fullName}
              onChange={handleInputChange}
              onKeyPress={onKeyPress}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Nombre de usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Ingresa tu nombre de usuario"
              autoComplete="username"
              value={formData.username}
              onChange={handleInputChange}
              onKeyPress={onKeyPress}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Ingresa tu correo electrónico"
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
              onKeyPress={onKeyPress}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Ingresa tu contraseña"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleInputChange}
                onKeyPress={onKeyPress}
              />
              <span 
                className="toggle-password" 
                onClick={() => togglePasswordVisibility('password')}
                style={{ userSelect: 'none' }}
              >
                {showPassword ? '◎' : '◉'}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <div className="password-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirma tu contraseña"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onKeyPress={onKeyPress}
              />
              <span 
                className="toggle-password" 
                onClick={() => togglePasswordVisibility('confirm')}
                style={{ userSelect: 'none' }}
              >
                {showConfirmPassword ? '◎' : '◉'}
              </span>
            </div>
          </div>

          <button
            id="signup-button"
            className="signup-button"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          <div className="login-link">
            ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
