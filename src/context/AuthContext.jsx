import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider, // <--- IMPORTANTE
  GithubAuthProvider, // <--- IMPORTANTE
  signInWithPopup     // <--- IMPORTANTE
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- REGISTRO EMAIL/PASS (Ya lo tenías) ---
  const signup = async (email, password, username) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;
    await updateProfile(newUser, { displayName: username });
    
    // Guardar en Firestore
    await setDoc(doc(db, "users", newUser.uid), {
      uid: newUser.uid,
      displayName: username,
      email: email,
      photoURL: null,
      createdAt: new Date()
    });
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  // --- NUEVA FUNCIÓN: LOGIN SOCIAL (GOOGLE/GITHUB) ---
  const loginWithSocial = async (providerName) => {
    let provider;
    if (providerName === 'google') provider = new GoogleAuthProvider();
    if (providerName === 'github') provider = new GithubAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // VERIFICAR SI EL USUARIO YA EXISTE EN BASE DE DATOS
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      // Si NO existe (es la primera vez que entra), lo guardamos
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL, // Guardamos su foto de Google/GitHub
          createdAt: new Date(),
          provider: providerName
        });
      }
      return user;
    } catch (error) {
      console.error("Error social login:", error);
      throw error;
    }
  };

  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loginWithSocial, loading }}>
      {children}
    </AuthContext.Provider>
  );
};