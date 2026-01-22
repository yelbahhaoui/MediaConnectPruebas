import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔴 REEMPLAZA ESTO CON TUS DATOS DE FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyDxJfQDAdAL-qOewWUVaPjNKJp3X_FdNpQ",
  authDomain: "mediaconnect-f4eca.firebaseapp.com",
  projectId: "mediaconnect-f4eca",
  storageBucket: "mediaconnect-f4eca.firebasestorage.app",
  messagingSenderId: "41499976396",
  appId: "1:41499976396:web:06e89d123beef69dddd869"
};


// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);