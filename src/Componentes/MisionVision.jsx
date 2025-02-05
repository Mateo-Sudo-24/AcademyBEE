import React from 'react';
import '../Componentes_css/MisionVision.css'; 

const MisionVision = () => {
  return (
    <section className="section-container mision-vision-container fade-in">
      <div className="mision-vision-content">
        <div className="text-section">
          <div className="mision-section">
            <h2>Misión</h2>
            <p>
            Contribuir al desarrollo económico y social de Ecuador, 
            ofreciendo oportunidades de capacitación y crecimiento profesional 
            a través de una plataforma educativa en línea, que permita a
            las personas mejorar su empleabilidad y calidad de vida.
            </p>
          </div>

          <div className="vision-section">
            <h2>Visión</h2>
            <p>
            Convertirnos en el motor de desarrollo de habilidades en Ecuador, 
            conectando a personas con las oportunidades laborales del futuro 
            y promoviendo la innovación y el emprendimiento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MisionVision;