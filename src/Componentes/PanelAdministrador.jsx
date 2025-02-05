import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
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
    const obtenerRolUsuario = async () => {
      if (!currentUser?.uid) return;

      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUserRole(userDoc.data().role || 'sin-rol');
        } else {
          throw new Error('Usuario no encontrado en Firestore.');
        }
      } catch (err) {
        setError(`Error al obtener el rol: ${err.message}`);
      }
    };

    obtenerRolUsuario();
  }, [currentUser]);

  useEffect(() => {
    if (userRole !== 'admin') return;

    const cargarUsuarios = async () => {
      try {
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        const usuariosData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setUsuarios(usuariosData);
      } catch (err) {
        setError(`Error al cargar usuarios: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuarios();
  }, [userRole]);

  const eliminarUsuario = async (userId) => {
    if (!window.confirm('¿Está seguro de eliminar este usuario?')) return;

    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsuarios(prevUsuarios => prevUsuarios.filter(u => u.id !== userId));
    } catch (err) {
      setError(`Error al eliminar usuario: ${err.message}`);
    }
  };

  const usuariosFiltrados = usuarios.filter(usuario => {
    const cumpleFiltro = filtro === 'todos' || usuario.role === filtro;
    const cumpleBusqueda =
      usuario.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(busqueda.toLowerCase());

    return cumpleFiltro && cumpleBusqueda;
  });

  if (userRole === null) {
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
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="busqueda-input"
        />

        <div className="filtros">
          {['todos', 'profesor', 'planNormal', 'planSocial'].map(tipo => (
            <button
              key={tipo}
              className={`filtro-btn ${filtro === tipo ? 'activo' : ''}`}
              onClick={() => setFiltro(tipo)}
            >
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </button>
          ))}
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
                <span className={`role-badge ${usuario.role}`}>
                  {usuario.role}
                </span>
              </div>

              <button className="eliminar-btn" onClick={() => eliminarUsuario(usuario.id)}>
                Eliminar Usuario
              </button>
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
