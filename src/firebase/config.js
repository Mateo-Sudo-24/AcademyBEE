// Importar funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Si necesitas almacenamiento

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAZMX0lLhQ6TkPMC3wmsCi_I1L_u6QFsPM",
  authDomain: "beeacademy-ff539.firebaseapp.com",
  projectId: "beeacademy-ff539",
  storageBucket: "beeacademy-ff539.appspot.com", // Corrección del bucket de storage
  messagingSenderId: "550016074746",
  appId: "1:550016074746:web:dd323cdf29e6d6012b9a43"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Si necesitas subir archivos

export { auth, db, storage };
