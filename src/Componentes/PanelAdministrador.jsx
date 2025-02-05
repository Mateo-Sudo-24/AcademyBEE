import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import {
  collection,
  query,
  getDocs,
  doc,
  deleteDoc,
  getDoc
} from 'firebase/firestore';
import '../Componentes_css/PanelAdministrador.css';
import LogoutButton from './LogoutButton';

const PanelAdministrador = () => {
  const { currentUser } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const obtenerRolUsuario = async () => {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUserRole(userDoc.data().role || '');
        } else {
          setError('No se encontró la información del usuario.');
        }
      } catch (error) {
        setError('Error al obtener la información del usuario.');
      } finally {
        setLoading(false);
      }
    };

    obtenerRolUsuario();
  }, [currentUser]);

  useEffect(() => {
    const cargarUsuarios = async () => {
      if (userRole !== 'admin') return;

      try {
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        setUsuarios(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        setError('Error al cargar los datos.');
      }
    };

    if (userRole === 'admin') {
      cargarUsuarios();
    }
  }, [userRole]);

  const eliminarUsuario = async (userId) => {
    if (!window.confirm('¿Está seguro de eliminar este usuario?')) return;

    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsuarios(usuarios.filter(u => u.id !== userId));
    } catch (error) {
      setError('Error al eliminar el usuario.');
    }
  };

  const usuariosFiltrados = usuarios.filter(usuario => {
    return (filtro === 'todos' || usuario.role === filtro) &&
      (usuario.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(busqueda.toLowerCase()));
  });

  if (loading) {
    return <div className="loading">Cargando datos...</div>;
  }

  if (userRole !== 'admin') {
    return <div className="error-acceso">Acceso no autorizado</div>;
  }

  return (
    <div className="panel-administrador">
      <div className="dashboard-header">
        <h1>Panel de Administración</h1>
        <p>Gestión de Usuarios y Registros</p>
        <LogoutButton />
      </div>

      <div className="controles">
        <div className="busqueda">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="busqueda-input"
          />
        </div>

        <div className="filtros">
          <button className={`filtro-btn ${filtro === 'todos' ? 'activo' : ''}`} onClick={() => setFiltro('todos')}>Todos</button>
          <button className={`filtro-btn ${filtro === 'profesor' ? 'activo' : ''}`} onClick={() => setFiltro('profesor')}>Profesores</button>
          <button className={`filtro-btn ${filtro === 'planNormal' ? 'activo' : ''}`} onClick={() => setFiltro('planNormal')}>Plan Normal</button>
          <button className={`filtro-btn ${filtro === 'planSocial' ? 'activo' : ''}`} onClick={() => setFiltro('planSocial')}>Plan Social</button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="usuarios-lista">
        {usuariosFiltrados.length > 0 ? (
          usuariosFiltrados.map(usuario => (
            <div key={usuario.id} className="usuario-card">
              <div className="usuario-info">
                <h3>{usuario.nombre} {usuario.apellido}</h3>
                <p className="email">{usuario.email}</p>
                <span className={`role-badge ${usuario.role}`}>{usuario.role}</span>
              </div>
              <button className="eliminar-btn" onClick={() => eliminarUsuario(usuario.id)}>Eliminar Usuario</button>
            </div>
          ))
        ) : (
          <p>No hay usuarios registrados.</p>
        )}
      </div>
    </div>
  );
};

export default PanelAdministrador;
