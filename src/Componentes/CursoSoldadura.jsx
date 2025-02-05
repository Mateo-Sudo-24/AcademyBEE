import React, { useState } from 'react';
import Navbar from '../Navbar';
import { jsPDF } from 'jspdf';
import '../Componentes_css/CursosRequest.css';

const CursoSoldadura = () => {
  const [progreso, setProgreso] = useState([false, false, false]);
  const [respuestas, setRespuestas] = useState(["", "", ""]);
  const [certificadoDisponible, setCertificadoDisponible] = useState(false);

  const preguntas = [
    { texto: "¿Cuál es el equipo principal de seguridad en la soldadura?", respuesta: "casco" },
    { texto: "¿Qué tipo de soldadura usa gas como protección?", respuesta: "mig" },
    { texto: "¿Qué metal se usa comúnmente en soldadura estructural?", respuesta: "acero" },
  ];

  const manejarRespuesta = (index, valor) => {
    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[index] = valor.toLowerCase();
    setRespuestas(nuevasRespuestas);

    if (nuevasRespuestas[index] === preguntas[index].respuesta) {
      const nuevoProgreso = [...progreso];
      nuevoProgreso[index] = true;
      setProgreso(nuevoProgreso);

      if (nuevoProgreso.every((estado) => estado === true)) {
        setCertificadoDisponible(true);
      }
    }
  };

  const generarCertificado = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Certificado de Finalización", 60, 40);
    doc.setFontSize(16);
    doc.text("BeeAcademy certifica que:", 60, 60);
    doc.setFontSize(18);
    doc.text("____________", 60, 80);
    doc.setFontSize(16);
    doc.text("Ha completado exitosamente el curso de Soldadura.", 60, 100);
    doc.text("Fecha: " + new Date().toLocaleDateString(), 60, 120);
    doc.text("Firma:", 60, 150);
    doc.text("____________________", 60, 160);
    doc.save("Certificado_Soldadura.pdf");
  };

  return (
    <div className="curso-container">
      <Navbar />
      <h1 className="curso-titulo">Curso de Soldadura</h1>

      <div className="curso-content">
        <div className="pasos-container">
          <h2>Pasos para completar el curso</h2>
          <ol>
            {preguntas.map((pregunta, index) => (
              <li key={index} className={`paso ${progreso[index] ? "completado" : ""}`}>
                <p>{pregunta.texto}</p>
                {!progreso[index] && (
                  <input
                    type="text"
                    placeholder="Ingrese la respuesta"
                    value={respuestas[index]}
                    onChange={(e) => manejarRespuesta(index, e.target.value)}
                  />
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="videos-container">
          <h2>Clases en Video</h2>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/YU94p4DJH3g"
            title="Video de Soldadura"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {certificadoDisponible && (
        <button className="certificado-btn" onClick={generarCertificado}>
          Obtener Certificado
        </button>
      )}
    </div>
  );
};

export default CursoSoldadura;
