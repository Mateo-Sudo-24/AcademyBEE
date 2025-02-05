import React from 'react';
import '../Componentes_css/Informacion.css'; 

const Informacion = () => {
  return (
    <div className="info-extra-container">
      <div className="info-extra-content">
        <h2 className="info-extra-title">Información sobre BeeAcademy</h2>
        <div className="info-grid">
          
          {/* ✅ SECCIÓN DE CURSOS */}
          <div className="info-card">
            <h3 className="section-title">Cursos Disponibles</h3>
            <ul className="info-list">
              <li className="info-item">Curso de Soldadura</li>
              <li className="info-item">Curso de Agricultura</li>
              <li className="info-item">Curso de Ganadería</li>
              <li className="info-item">Curso de Alfabetización</li>
              <li className="info-item">Curso de Ofimática</li>
            </ul>
          </div>
          
          {/* ✅ SECCIÓN DE RECURSOS EDUCATIVOS */}
          <div className="info-card">
            <h3 className="section-title">Recursos de Aprendizaje</h3>
            <ul className="info-list">
              <li className="info-item">Materiales de lectura en PDF</li>
              <li className="info-item">Clases en video interactivas</li>
              <li className="info-item">Tutorías en línea</li>
              <li className="info-item">Certificados de finalización</li>
              <li className="info-item">Foros de discusión</li>
            </ul>
          </div>
          
          {/* ✅ SECCIÓN DE SOPORTE Y COMUNIDAD */}
          <div className="info-card">
            <h3 className="section-title">Apoyo y Comunidad</h3>
            <ul className="info-list">
              <li className="info-item">Acceso a comunidad de aprendizaje</li>
              <li className="info-item">Grupos de estudio colaborativos</li>
              <li className="info-item">Eventos y seminarios web</li>
              <li className="info-item">Asesoramiento profesional</li>
              <li className="info-item">Oportunidades de voluntariado</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Informacion;
