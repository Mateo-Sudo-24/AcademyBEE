import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

/* Páginas principales */
import Home from './Componentes/Home';
import Navbar from './Componentes/Navbar';
import MisionVision from './Componentes/MisionVision';
import Contacto from './Componentes/Contacto';
import Informacion from './Componentes/Informacion';
import Login from './Componentes/Login';
import Registro from './Componentes/Registro';

/* Paneles */
import PanelProfesor from './Componentes/PanelProfesor';
import PanelPlanSocial from './Componentes/PanelPlanSocial';
import PanelPlanNormal from './Componentes/PanelPlanNormal'; // ✅ Corrección aplicada
import Cursos from './Componentes/Cursos';

/* Cursos */
import CursoSoldadura from './Componentes/CursoSoldadura';
import CursoAgricultura from './Componentes/CursoAgricultura';
import CursoGanaderia from './Componentes/CursoGanaderia';
import CursoAlfabetizacion from './Componentes/CursoAlfabetizacion';
import CursoMatematicas from './Componentes/CursoMatematicas';
import CursoOfimatica from './Componentes/CursoOfimatica';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mision-vision" element={<MisionVision />} />
          <Route path="/informacion" element={<Informacion />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Paneles */}
          <Route path="/panel-profesor" element={<PanelProfesor />} />
          <Route path="/panel-plan-social" element={<PanelPlanSocial />} />
          <Route path="/panel-plan-normal" element={<PanelPlanNormal />} /> {/* ✅ Corrección aplicada */}
          <Route path="/cursos" element={<Cursos />} />

          {/* Cursos */}
          <Route path="/curso/soldadura" element={<CursoSoldadura />} />
          <Route path="/curso/agricultura" element={<CursoAgricultura />} />
          <Route path="/curso/ganaderia" element={<CursoGanaderia />} />
          <Route path="/curso/alfabetizacion" element={<CursoAlfabetizacion />} />
          <Route path="/curso/matematicas" element={<CursoMatematicas />} />
          <Route path="/curso/ofimatica" element={<CursoOfimatica />} />

          <Route path="*" element={<div>Página no encontrada</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
