import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { 
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  getDoc
} from 'firebase/firestore';
import '../Componentes_css/PanelAdministrador.css';
import LogoutButton from './LogoutButton'; // ✅ Importación del botón de logout

const PanelAdministrador = () => {  // ✅ Cambio de nombre correcto

  const { currentUser } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar todos los usuarios
  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        // Verificar si el usuario tiene rol de admin
        if (currentUser?.role !== 'admin') {
          setError('Acceso no autorizado');
          return;
        }

        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        let usuariosData = [];

        for (const userDoc of usersSnapshot.docs) {
          const userData = userDoc.data();
          const userId = userDoc.id;

          usuariosData.push({
            id: userId,
            ...userData
          });
        }

        setUsuarios(usuariosData);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    cargarUsuarios();
  }, [currentUser]);

  const eliminarUsuario = async (userId) => {
    if (!window.confirm('¿Está seguro de eliminar este usuario?')) return;

    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsuarios(usuarios.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setError('Error al eliminar el usuario');
    }
  };

  const usuariosFiltrados = usuarios.filter(usuario => {
    const cumpleFiltro = filtro === 'todos' || usuario.role === filtro;
    const cumpleBusqueda = 
      usuario.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleFiltro && cumpleBusqueda;
  });

  if (!currentUser || currentUser.role !== 'admin') {
    return <div className="error-acceso">Acceso no autorizado</div>;
  }

  return (
    <div className="panel-administrador">
      <div className="dashboard-header">
        <h1>Panel de Administración</h1>
        <p>Gestión de Usuarios y Registros</p>
        <LogoutButton /> {/* ✅ Se agregó el botón de logout en el header */}
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
          <button
            className={`filtro-btn ${filtro === 'todos' ? 'activo' : ''}`}
            onClick={() => setFiltro('todos')}
          >
            Todos
          </button>
          <button
            className={`filtro-btn ${filtro === 'profesor' ? 'activo' : ''}`}
            onClick={() => setFiltro('profesor')}
          >
            Profesores
          </button>
          <button
            className={`filtro-btn ${filtro === 'planNormal' ? 'activo' : ''}`}
            onClick={() => setFiltro('planNormal')}
          >
            Plan Normal
          </button>
          <button
            className={`filtro-btn ${filtro === 'planSocial' ? 'activo' : ''}`}
            onClick={() => setFiltro('planSocial')}
          >
            Plan Social
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Cargando usuarios...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="usuarios-lista">
          {usuariosFiltrados.map(usuario => (
            <div key={usuario.id} className="usuario-card">
              <div className="usuario-info">
                <h3>{usuario.nombre} {usuario.apellido}</h3>
                <p className="email">{usuario.email}</p>
                <span className={`role-badge ${usuario.role}`}>
                  {usuario.role}
                </span>
              </div>

              <button
                className="eliminar-btn"
                onClick={() => eliminarUsuario(usuario.id)}
              >
                Eliminar Usuario
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PanelAdministrador;
