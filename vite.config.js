import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite para BeeAcademy
export default defineConfig({
  base: "/", // ✅ Asegura que la ruta base sea correcta (modifícala si subes a GitHub Pages)
  plugins: [react()],
  server: {
    port: 5173, // ✅ Usa el puerto 5173 por defecto o cámbialo si está en uso
    open: true, // ✅ Abre automáticamente en el navegador
  },
  define: {
    __APP_NAME__: JSON.stringify("BeeAcademy") // ✅ Define el nombre del proyecto
  }
});
