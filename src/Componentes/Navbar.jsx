import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'; // ✅ faBug en lugar de faBee
import '../Componentes_css/Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* ✅ LOGO AHORA REDIRIGE A INICIO */}
      <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
        <FontAwesomeIcon icon={faBug} className="bee-icon" /> {/* Se cambió faBee por faBug */}
        <span className="navbar-title">BEE Academy</span>
      </Link>

      {/* Botón de menú hamburguesa */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
      </div>

      {/* Menú de enlaces */}
      <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Inicio</Link>
        <Link to="/mision-vision" className="nav-link" onClick={() => setMenuOpen(false)}>Misión y Visión</Link>
        <Link to="/informacion" className="nav-link" onClick={() => setMenuOpen(false)}>Información</Link>
        <Link to="/contacto" className="nav-link" onClick={() => setMenuOpen(false)}>Contacto</Link>
        <Link to="/registro" className="nav-link" onClick={() => setMenuOpen(false)}>Registro</Link>
      </div>
    </nav>
  );
};

export default Navbar;
