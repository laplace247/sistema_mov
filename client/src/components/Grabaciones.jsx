import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Grabaciones.css';

const Grabaciones = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Datos de ejemplo de grabaciones
  const grabaciones = [
    {
      id: 1,
      titulo: "Movimiento detectado",
      fecha: "2025-05-31",
      hora: "14:32",
      video: "/videos/grabacion1.mp4",
      poster: "/img/frame1.jpg"
    },
    {
      id: 2,
      titulo: "Movimiento detectado",
      fecha: "2025-05-31",
      hora: "14:32",
      video: "/videos/grabacion1.mp4",
      poster: "/img/frame1.jpg"
    },
    {
      id: 3,
      titulo: "Movimiento detectado",
      fecha: "2025-05-31",
      hora: "14:32",
      video: "/videos/grabacion1.mp4",
      poster: "/img/frame1.jpg"
    }
  ];

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
          <Link to="/grabaciones" className="active">GRABACIONES</Link>
          <Link to="/live">EN DIRECTO</Link>
          <Link to="/acerca">ACERCA DE</Link>
          <button className="logout responsive-only" onClick={handleLogout}>CERRAR SESIÓN</button>
        </nav>

        <button className="logout desktop-only" onClick={handleLogout}>CERRAR SESIÓN</button>
      </header>

      <section className="grabaciones-container">
        <div className="wrapper">
          <h1>Historial de Grabaciones</h1>
          <h3 className="subtitulo">Grabaciones registradas por el sistema</h3>
          <p className="subtexto">
            Accede a las grabaciones captadas por el sistema de vigilancia. Cada evento está marcado con
            fecha y hora exacta.
          </p>

          <div className="grabaciones-grid">
            {grabaciones.map((grabacion) => (
              <div key={grabacion.id} className="grabacion-card">
                <video controls poster={grabacion.poster}>
                  <source src={grabacion.video} type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
                <div className="info">
                  <h3>{grabacion.titulo}</h3>
                  <span>Fecha: {grabacion.fecha}</span>
                  <span>Hora: {grabacion.hora}</span>
                </div>
              </div>
            ))}
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

export default Grabaciones;