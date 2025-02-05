import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import '../Componentes_css/Registro.css';

const Registro = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido: '',
    telefono: '',
    role: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Verificar si el usuario ya existe en Firestore antes de crear la cuenta
  const checkUserExists = async (email) => {
    const userRef = doc(db, 'users', email);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres.');
    }

    if (formData.password !== formData.confirmPassword) {
      return setError('Las contraseñas no coinciden.');
    }

    if (!formData.role) {
      return setError('Debe seleccionar un rol antes de registrarse.');
    }

    setLoading(true);
    setError('');

    try {
      const userExists = await checkUserExists(formData.email);
      if (userExists) {
        setError('El correo ya está registrado.');
        setLoading(false);
        return;
      }

      const user = await signup(formData.email, formData.password, formData.role, {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        role: formData.role,
      });

      if (!user) {
        setError('Error al registrar el usuario.');
        return;
      }

      // Redirigir según el rol
      switch (formData.role) {
        case 'Profesor':
          navigate('/panel-profesor');
          break;
        case 'PlanSocial':
          navigate('/panel-plan-social');
          break;
        case 'PlanNormal':
          navigate('/plan-normal');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      setError('Error al crear la cuenta: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-content">
        <h2>Registro de Usuario</h2>

        {error && <div className="error-message">{error}</div>}

        <button className="return-home-btn" onClick={() => navigate('/')}>
          ← Volver a Inicio
        </button>

        {/* Modal para selección de roles */}
        <button className="open-modal-btn" onClick={() => setIsModalOpen(true)}>
          Seleccionar Rol
        </button>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>Seleccione su rol:</h3>
              <button className="role-btn" onClick={() => setFormData({ ...formData, role: 'Profesor' })}>
                Profesor
              </button>
              <button className="role-btn" onClick={() => setFormData({ ...formData, role: 'PlanSocial' })}>
                Plan Social
              </button>
              <button className="role-btn" onClick={() => setFormData({ ...formData, role: 'PlanNormal' })}>
                Plan Normal
              </button>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Formulario de registro */}
        <form onSubmit={handleSubmit} className="registro-form">
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Apellido</label>
            <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Correo Electrónico</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registro;
