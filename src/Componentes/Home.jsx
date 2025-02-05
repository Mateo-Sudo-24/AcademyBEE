import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Importamos el Navbar
import '../Componentes_css/Home.css';
import abejaEstudiando from '../assets/abeja-estudiando.png'; // Imagen de la abeja ayudando a estudiar

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Navbar /> {/* ✅ Navbar agregado */}

      <div className="content-wrapper">
        {/* Sección de texto */}
        <div className="text-section">
          <h1 className="main-title">Bienvenidos a BeeAcademy</h1>
          <p className="slogan">Un aplicativo web que transforma vidas a través de la educación</p>

          {/* Nueva descripción de BeeAcademy */}
          <p className="description">
            En <strong>BeeAcademy</strong>, creemos que la educación es la clave para un mejor futuro. 
            A través de nuestro <strong>Plan Social</strong>, ayudamos a personas en situación de vulnerabilidad 
            a acceder a cursos gratuitos. También ofrecemos <strong>cursos especializados</strong> para quienes 
            desean mejorar sus habilidades con certificaciones pagadas.  
          </p>

          <div className="buttons-container">
            <button 
              className="action-button login-btn"
              onClick={() => navigate('/login')}
            >
              Iniciar Sesión
            </button>
            <button 
              className="action-button register-btn"
              onClick={() => navigate('/registro')}
            >
              Registrarse
            </button>
          </div>
        </div>

        {/* Imagen a la derecha */}
        <div className="image-section">
          <img src={abejaEstudiando} alt="Abeja ayudando a estudiar" className="abeja-img" />
        </div>
      </div>
    </div>
  );
};

export default Home;
