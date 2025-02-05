import React, { useState } from 'react';
import Navbar from "../Componentes/Navbar";
import { jsPDF } from "jspdf";
import "../Componentes_css/CursosRequest.css";

const CursoOfimatica = () => {
  const [progress, setProgress] = useState(0);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Certificado de Curso de Ofimática", 10, 10);
    doc.save("certificado_ofimatica.pdf");
  };

  return (
    <div className="curso-container">
      <Navbar />
      <h1>Curso de Ofimática</h1>
      <p>Aprende herramientas esenciales para la productividad.</p>

      <div className="progress-section">
        <h4>Progreso del curso</h4>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p>{progress}% completado</p>
      </div>

      <button onClick={generatePDF} className="certificado-btn">
        Descargar Certificado
      </button>
    </div>
  );
};

export default CursoOfimatica;
