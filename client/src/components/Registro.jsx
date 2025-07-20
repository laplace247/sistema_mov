import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Registro.css';

const Registro = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Datos de ejemplo de registros
  const registros = [
    {
      nombre: "video_2025-05-20_15-30-00.mp4",
      peso: "15 MB",
      fecha: "20/05/2025",
      hora: "15:30:00"
    },
    {
      nombre: "video_2025-05-21_08-15-12.mp4",
      peso: "13 MB",
      fecha: "21/05/2025",
      hora: "08:15:12"
    },
    {
      nombre: "video_2025-05-22_12-45-05.mp4",
      peso: "14 MB",
      fecha: "22/05/2025",
      hora: "12:45:05"
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
          <Link to="/registro" className="active">REGISTRO</Link>
          <Link to="/grabaciones">GRABACIONES</Link>
          <Link to="/live">EN DIRECTO</Link>
          <Link to="/acerca">ACERCA DE</Link>
          <button className="logout responsive-only" onClick={handleLogout}>CERRAR SESIÓN</button>
        </nav>

        <button className="logout desktop-only" onClick={handleLogout}>CERRAR SESIÓN</button>
      </header>

      <section className="home">
        <div className="registro-container">
          <div className="registro-header">
            <h1>Registros de Grabaciones</h1>
            <h3>Historial de videos capturados</h3>
            <p>
              Aquí podrás visualizar todos los archivos generados por el sistema de vigilancia,
              incluyendo detalles como nombre del archivo, tamaño, fecha y hora de creación.
            </p>
          </div>

          <div className="registro-table-container">
            <table className="registro-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre del Archivo</th>
                  <th>Peso</th>
                  <th>Fecha de Creación</th>
                  <th>Hora</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((registro, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{registro.nombre}</td>
                    <td>{registro.peso}</td>
                    <td>{registro.fecha}</td>
                    <td>{registro.hora}</td>
                    <td>
                      <a href={`/videos/${registro.nombre}`} target="_blank" rel="noopener noreferrer">
                        Ver
                      </a>
                      <a href={`/videos/${registro.nombre}`} download>
                        Descargar
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default Registro;