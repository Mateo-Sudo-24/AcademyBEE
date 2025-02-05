import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Navbar from './Navbar';
import '../Componentes_css/PanelProfesor.css';

const PanelProfesor = () => {
  const { currentUser } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [questions, setQuestions] = useState([]);
  const [respuestas, setRespuestas] = useState({}); // ✅ Estado para capturar respuestas antes de enviarlas

  useEffect(() => {
    // ✅ Cargar estudiantes con su progreso
    const cargarEstudiantes = async () => {
      try {
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);
        const studentsData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((user) => user.role === 'PlanSocial' || user.role === 'PlanNormal');

        setStudents(studentsData);
      } catch (error) {
        console.error('Error al cargar estudiantes:', error);
        setMensaje('Error al cargar los estudiantes.');
      } finally {
        setLoadingStudents(false);
      }
    };

    cargarEstudiantes();

    // ✅ Cargar preguntas en tiempo real
    const unsubscribe = onSnapshot(collection(db, 'preguntas'), (snapshot) => {
      const preguntasData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setQuestions(preguntasData);
      setLoadingQuestions(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Función para manejar cambios en respuestas antes de enviarlas
  const manejarCambioRespuesta = (preguntaId, valor) => {
    setRespuestas((prevRespuestas) => ({
      ...prevRespuestas,
      [preguntaId]: valor,
    }));
  };

  // ✅ Función para responder preguntas
  const responderPregunta = async (preguntaId) => {
    try {
      const respuesta = respuestas[preguntaId];
      if (!respuesta) {
        setMensaje('No puedes enviar una respuesta vacía.');
        return;
      }

      const preguntaRef = doc(db, 'preguntas', preguntaId);
      await updateDoc(preguntaRef, { respuesta });

      setMensaje('Respuesta enviada con éxito.');
      setRespuestas((prev) => ({ ...prev, [preguntaId]: '' })); // ✅ Limpiar la respuesta después de enviarla
    } catch (error) {
      console.error('Error al responder pregunta:', error);
      setMensaje('Error al responder la pregunta.');
    }
  };

  return (
    <div className="panel-profesor">
      <Navbar /> {/* ✅ Navbar agregado */}

      <div className="dashboard-header">
        <h1>Profesor: {currentUser?.nombre}</h1>
      </div>

      <div className="dashboard-content">
        {/* 📌 Sección de Calendario */}
        <div className="calendario-section">
          <div className="card">
            <h2>Calendario de Cursos</h2>
            <Calendar onChange={setSelectedDate} value={selectedDate} />
          </div>
        </div>

        {/* 📌 Sección de Progreso de Estudiantes */}
        <div className="students-section">
          <h2>Progreso de Estudiantes</h2>
          {loadingStudents ? (
            <p>Cargando estudiantes...</p>
          ) : students.length > 0 ? (
            <div className="students-list">
              {students.map((student) => (
                <div key={student.id} className="student-card">
                  <h3>{student.nombre} {student.apellido}</h3>
                  <p>Plan: {student.role}</p>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${student.progreso || 0}%` }}></div>
                    </div>
                    <p>{student.progreso || 0}% completado</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay estudiantes registrados.</p>
          )}
        </div>

        {/* 📌 Sección de Preguntas y Respuestas */}
        <div className="questions-section">
          <h2>Preguntas de Estudiantes</h2>
          {loadingQuestions ? (
            <p>Cargando preguntas...</p>
          ) : questions.length > 0 ? (
            <div className="questions-list">
              {questions.map((question) => (
                <div key={question.id} className="question-card">
                  <p><strong>{question.estudiante}:</strong> {question.pregunta}</p>
                  {question.respuesta ? (
                    <p className="respuesta"><strong>Respuesta:</strong> {question.respuesta}</p>
                  ) : (
                    <div className="respuesta-input">
                      <input
                        type="text"
                        placeholder="Escribe tu respuesta..."
                        value={respuestas[question.id] || ''}
                        onChange={(e) => manejarCambioRespuesta(question.id, e.target.value)}
                      />
                      <button onClick={() => responderPregunta(question.id)}>Responder</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No hay preguntas pendientes.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanelProfesor;
