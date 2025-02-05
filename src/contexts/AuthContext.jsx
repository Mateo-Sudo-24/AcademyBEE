import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Hook para acceder al contexto
export function useAuth() {
    return useContext(AuthContext);
}

// Proveedor de autenticación
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Función para registrar usuarios con rol
    async function signup(email, password, role, userData) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Guardar datos adicionales en Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email,
                role, // Profesor, PlanSocial o PlanNormal
                ...userData,
                createdAt: new Date().toISOString()
            });

            return user;
        } catch (error) {
            console.error("Error en registro:", error.message);
            throw error;
        }
    }

    // Función para iniciar sesión
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    // Función para cerrar sesión
    function logout() {
        return signOut(auth);
    }

    // Observer para detectar cambios en el usuario
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Obtener información adicional del usuario desde Firestore
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setCurrentUser({ ...user, ...userDoc.data() });
                } else {
                    setCurrentUser(user);
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Proveer valores a los componentes
    const value = {
        currentUser,
        signup,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
