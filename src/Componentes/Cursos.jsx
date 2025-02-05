import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import '../Componentes_css/Cursos.css';

const Cursos = ({ showPremium }) => {
  const navigate = useNavigate();

  return (
    <div className="cursos-container">
      <Navbar /> {/* ✅ Navbar agregado */}

      <h1 className="cursos-title">Seleccione un Curso</h1>

      <div className="cursos-botones">
        <button className="course-btn" onClick={() => navigate('/curso/soldadura')}>Curso de Soldadura</button>
        <button className="course-btn" onClick={() => navigate('/curso/agricultura')}>Curso de Agricultura</button>
        <button className="course-btn" onClick={() => navigate('/curso/ganaderia')}>Curso de Ganadería</button>
        <button className="course-btn" onClick={() => navigate('/curso/alfabetizacion')}>Curso de Alfabetización</button>
        <button className="course-btn" onClick={() => navigate('/curso/matematicas')}>Curso de Matemáticas</button>
        <button className="course-btn" onClick={() => navigate('/curso/ofimatica')}>Curso de Ofimática</button>
        
        {/* ✅ Plan Premium solo visible para los de "Plan Normal" */}
        {showPremium && (
          <button className="premium-btn">Plan Premium</button>
        )}
      </div>
    </div>
  );
};

export default Cursos;
