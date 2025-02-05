import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config'; // ✅ Importar Firebase correctamente
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Navbar from './Navbar';
import '../Componentes_css/Login.css';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 🔹 Iniciar sesión con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔹 Obtener rol desde Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        setError('No se encontró el usuario en la base de datos.');
        setLoading(false);
        return;
      }

      const userData = userDoc.data();
      const role = userData.role; // ✅ Se obtiene el rol registrado

      // 🔹 Redirigir automáticamente según el rol
      switch (role) {
        case 'Profesor':
          navigate('/panel-profesor');
          break;
        case 'PlanSocial':
          navigate('/panel-plan-social');
          break;
        case 'PlanNormal':
          navigate('/plan-normal');
          break;
        case 'admin':
          navigate('/panel-administrador');
          break;
        default:
          setError('Rol no válido.');
      }
    } catch (err) {
      setError('Error al iniciar sesión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Navbar /> {/* ✅ Navbar agregado */}

      <div className="login-content">
        <h2>Iniciar Sesión</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
