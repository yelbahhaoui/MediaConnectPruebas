import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../services/firebase"; // <--- IMPORTANTE: Importar db
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // <--- IMPORTANTE: Importar doc y setDoc

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- FUNCIÓN DE REGISTRO CORREGIDA ---
  const signup = async (email, password, username) => {
    // 1. Crear usuario en Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;
    
    // 2. Actualizar perfil básico
    await updateProfile(newUser, { displayName: username });
    
    // 3. ¡ESTO ES LO QUE TE FALTABA! Guardar en la Base de Datos
    await setDoc(doc(db, "users", newUser.uid), {
      uid: newUser.uid,
      displayName: username, // El buscador busca esto
      email: email,
      photoURL: null,
      createdAt: new Date()
    });
  };
  // -------------------------------------

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};