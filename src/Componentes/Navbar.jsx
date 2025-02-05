import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBee, FaBars, FaTimes } from 'react-icons/fa'; // Íconos de abeja, menú y cerrar
import '../Componentes_css/Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* ✅ LOGO AHORA REDIRIGE A INICIO */}
      <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
        <FaBee className="bee-icon" /> {/* Ícono de abeja */}
        <span className="navbar-title">Brújula Vital</span>
      </Link>

      {/* Botón de menú hamburguesa */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
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
