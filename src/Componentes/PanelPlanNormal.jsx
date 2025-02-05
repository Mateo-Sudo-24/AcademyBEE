import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import {
  collection,
  doc,
  updateDoc,
  getDoc,
  addDoc,
  onSnapshot,
} from 'firebase/firestore';
import Navbar from './Navbar';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Link } from 'react-router-dom';
import '../Componentes_css/PanelPlanNormal.css';

const PanelPlanNormal = () => {
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [progresoCursos, setProgresoCursos] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [pregunta, setPregunta] = useState('');
  const [mensaje, setMensaje] = useState('');
  const isPlanNormal = currentUser?.role === 'PlanNormal'; // ✅ Verificación del rol

  useEffect(() => {
    if (!currentUser) return;

    const cargarProgreso = async () => {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setProgresoCursos(userDoc.data().progresoCursos || {});
        }
      } catch (error) {
        setError('Error al cargar progreso de cursos.');
      } finally {
        setLoading(false);
      }
    };

    cargarProgreso();
  }, [currentUser]);

  // ✅ Función para actualizar progreso en Firebase
  const actualizarProgreso = async (curso, progreso) => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        [`progresoCursos.${curso}`]: progreso,
      });
      setProgresoCursos((prev) => ({ ...prev, [curso]: progreso }));
    } catch (error) {
      setError('Error al actualizar progreso.');
    }
  };

  // ✅ Función para enviar preguntas a Firebase
  const enviarPregunta = async () => {
    if (!pregunta.trim()) {
      setMensaje('No puedes enviar una pregunta vacía.');
      return;
    }

    try {
      await addDoc(collection(db, 'preguntas'), {
        estudiante: currentUser.nombre,
        pregunta,
        curso: selectedCourse,
        respuesta: null,
        fecha: new Date().toISOString(),
      });

      setMensaje('Pregunta enviada con éxito.');
      setPregunta('');
    } catch (error) {
      setMensaje('Error al enviar la pregunta.');
    }
  };

  return (
    <div className="panel-plan-normal">
      <Navbar /> {/* ✅ Navbar agregado */}

      {/* Barra superior con el nombre del usuario */}
      <div className="top-bar">
        <h2>Bienvenido, {currentUser?.nombre || 'Usuario'}</h2>
      </div>

      <div className="panel-content">
        {/* 📌 Sección de cursos accesibles */}
        <div className="courses-list">
          <h3>Cursos Disponibles</h3>
          {['soldadura', 'agricultura', 'ganaderia', 'alfabetizacion', 'matematicas', 'ofimatica'].map((curso) => (
            <button key={curso} onClick={() => setSelectedCourse(curso)} className="course-btn">
              Curso de {curso.charAt(0).toUpperCase() + curso.slice(1)}
            </button>
          ))}

          {/* ✅ Si el usuario es Plan Normal, muestra la opción de Plan Premium */}
          {isPlanNormal && <button className="premium-btn">Plan Premium</button>}
        </div>

        {/* 📌 Dashboard con progreso y actividades */}
        <div className="dashboard">
          <h3>Dashboard de Actividades</h3>

          {/* ✅ Calendario */}
          <div className="calendar-section">
            <h4>Actividades Pendientes</h4>
            <Calendar value={selectedDate} onChange={setSelectedDate} />
          </div>

          {/* ✅ Progreso de los cursos */}
          <div className="progress-section">
            <h4>Progresión de Cursos</h4>
            {loading ? (
              <p>Cargando progreso...</p>
            ) : (
              Object.keys(progresoCursos).length > 0 ? (
                Object.entries(progresoCursos).map(([curso, progreso]) => (
                  <div key={curso} className="progress-container">
                    <p>{curso.charAt(0).toUpperCase() + curso.slice(1)}</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progreso}%` }}></div>
                    </div>
                    <p>{progreso}% completado</p>
                    <button onClick={() => actualizarProgreso(curso, progreso + 10)}>+10%</button>
                  </div>
                ))
              ) : (
                <p>No hay progreso registrado aún.</p>
              )
            )}
          </div>

          {/* ✅ Clases del curso seleccionado */}
          {selectedCourse && (
            <div className="course-classes">
              <h4>Clases de {selectedCourse.charAt(0).toUpperCase() + selectedCourse.slice(1)}</h4>
              <ul>
                <li><Link to={`/curso/${selectedCourse}/clase1`}>Clase 1</Link></li>
                <li><Link to={`/curso/${selectedCourse}/clase2`}>Clase 2</Link></li>
                <li><Link to={`/curso/${selectedCourse}/clase3`}>Clase 3</Link></li>
              </ul>

              {/* ✅ Sección para hacer preguntas */}
              <div className="question-section">
                <h4>Hacer una Pregunta</h4>
                <textarea
                  placeholder="Escribe tu pregunta aquí..."
                  value={pregunta}
                  onChange={(e) => setPregunta(e.target.value)}
                />
                <button onClick={enviarPregunta}>Enviar Pregunta</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Mensajes de error y éxito */}
      {mensaje && <div className="mensaje">{mensaje}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default PanelPlanNormal;
