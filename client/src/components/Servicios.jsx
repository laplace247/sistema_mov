import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Servicios.css';

const Servicios = () => {
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
          <Link to="/servicios" className="active">SERVICIOS</Link>
          <Link to="/registro">REGISTRO</Link>
          <Link to="/grabaciones">GRABACIONES</Link>
          <Link to="/live">EN DIRECTO</Link>
          <Link to="/acerca">ACERCA DE</Link>
          <button className="logout responsive-only" onClick={handleLogout}>CERRAR SESIÓN</button>
        </nav>

        <button className="logout desktop-only" onClick={handleLogout}>CERRAR SESIÓN</button>
      </header>

      <section className="home servicios">
        <div className="home-content">
          <h1>Servicios del Sistema</h1>
          <h3>Seguridad automatizada y eficiente</h3>
          <p>
            Nuestro sistema de vigilancia inteligente ofrece una solución integral para proteger
            espacios mediante monitoreo en tiempo real, registro de anomalías y alertas instantáneas.
            A continuación, conoce los servicios principales que ofrecemos:
          </p>

          <ul className="servicios-lista">
            <li><i className='bx bx-video-recording'></i> Grabación automática con fecha y hora al detectar movimiento.</li>
            <li><i className='bx bx-bell'></i> Notificación de alertas al teléfono Android del administrador (tono y vibración).</li>
            <li><i className='bx bx-mobile-alt'></i> App Android conectada por red WiFi local, sin necesidad de internet.</li>
            <li><i className='bx bx-chip'></i> Sistema basado en ESP32-CAM con sensor de movimiento incorporado.</li>
            <li><i className='bx bx-data'></i> Almacenamiento de eventos en base de datos con historial accesible.</li>
            <li><i className='bx bx-camera'></i> Visualización en vivo desde cualquier dispositivo en la red.</li>
          </ul>

          <div className="btn-box">
            <Link to="/registro">Explorar Registros</Link>
            <Link to="/live">Ver en Directo</Link>
          </div>

          <div className="home-sci">
            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer">
              <i className='bxl bx-facebook'></i>
            </a>
            <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
              <i className='bxl bx-twitter-x'></i>
            </a>
            <a href="https://api.whatsapp.com/send?phone=51970913100&text=Hola,%20estoy%20interesado%20en%20un%20producto..." target="_blank" rel="noopener noreferrer">
              <i className='bxl bx-whatsapp'></i>
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <span>&copy; 2025 Sistema de Vigilancia. Todos los derechos reservados.</span>
        <div>
          <span>
            Desarrollado por: <a href="#">laplace247</a> Teléfono: <a href="tel:+51970913100">+51 970913100</a> Contacto:
            <a href="mailto:mv38621@gmail.com"> mv38621@gmail.com</a>
          </span>
        </div>
        <div>
          <a href="#">Términos y condiciones</a>
        </div>
      </footer>
    </>
  );
};

export default Servicios;