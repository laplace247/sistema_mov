import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Acerca.css';

const Acerca = () => {
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
          <Link to="/live">EN DIRECTO</Link>
          <Link to="/acerca" className="active">ACERCA DE</Link>
          <button className="logout responsive-only" onClick={handleLogout}>CERRAR SESIÓN</button>
        </nav>

        <button className="logout desktop-only" onClick={handleLogout}>CERRAR SESIÓN</button>
      </header>

      <section className="home">
        <div className="home-content">
          <h1>Acerca del sistema de vigilancia inteligente</h1>
          <h3>Proyecto de seguridad con ESP32-CAM y alertas en tiempo real</h3>
          <p>
            Este sistema ha sido desarrollado como una solución integral para la vigilancia en entornos laborales, 
            almacenes o espacios que requieren monitoreo constante. Utiliza una cámara ESP32-CAM con detección de 
            movimiento, capaz de registrar eventos sospechosos y enviar alertas inmediatas mediante una aplicación Android. 
            Además, las grabaciones se almacenan con fecha y hora, y las anomalías detectadas quedan registradas en una 
            base de datos para su posterior análisis.
          </p>
          <p>
            El objetivo principal es mejorar la seguridad, automatizando la supervisión y reduciendo el margen de error 
            humano, todo sin necesidad de conexión a Internet externa, ya que opera mediante red WiFi local.
          </p>

          <div className="btn-box">
            <a href="#">Ver más</a>
            <a href="#">Contáctanos</a>
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

export default Acerca;