import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Live.css';

const Live = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userData');
    navigate('/');
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <img src="/img/logo.png" alt="Logo" className="logo" />
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>☰</button>

        <nav className={`navbar ${menuOpen ? 'show' : ''}`} id="navbar">
          <Link to="/dashboard">HOME</Link>
          <Link to="/servicios">SERVICIOS</Link>
          <Link to="/registro">REGISTRO</Link>
          <Link to="/grabaciones">GRABACIONES</Link>
          <Link to="/live" className="active">EN DIRECTO</Link>
          <Link to="/acerca">ACERCA DE</Link>
          <button className="logout responsive-only" onClick={handleLogout}>CERRAR SESIÓN</button>
        </nav>

        <button className="logout desktop-only" onClick={handleLogout}>CERRAR SESIÓN</button>
      </header>

      <section className="live-view">
        <div className="stream-box">
          <h1>Transmisión en Vivo</h1>
          <h3>Visualización en tiempo real desde la cámara de seguridad</h3>
          
          <div className="video-frame">
            {/* Aquí va el feed en vivo del ESP32-CAM u otro módulo */}
            <img 
              src="http://localhost:5000/video_feed" 
              frameBorder="0"
              allowFullScreen
              title="Video Feed en Vivo"
            />
          </div>
          
          <p className="description">
            El sistema transmite en vivo cualquier movimiento detectado en el área monitoreada.
            Esta función permite supervisión en tiempo real desde cualquier dispositivo conectado a la red local.
          </p>
        </div>
      </section>

      <footer className="footer">
        <span>&copy; 2025 Sistema de Vigilancia. Todos los derechos reservados.</span>
        <div>
          <span>
            Desarrollado por: <a href="#">laplace247</a> Teléfono: <a href="tel:+51970913100">+51 970913100</a>{' '}
            Contacto: <a href="mailto:mv38621@gmail.com">mv38621@gmail.com</a>
          </span>
        </div>
        <div>
          <a href="#">Términos y condiciones</a>
        </div>
      </footer>
    </>
  );
};

export default Live;