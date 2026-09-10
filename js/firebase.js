// Archivo centralizado con tus credenciales e inicialización

// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Pega aquí el firebaseConfig que copiaste de la consola
const firebaseConfig = {
  apiKey: "AIzaSyBze__Uep8x0oxK6NGoVmbs075bjMhjwrQ",
  authDomain: "dashboard-ludopatia.firebaseapp.com",
  projectId: "dashboard-ludopatia",
  storageBucket: "dashboard-ludopatia.firebasestorage.app",
  messagingSenderId: "8500823264",
  appId: "1:8500823264:web:9daaf9d495c6bf6428bc85"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);