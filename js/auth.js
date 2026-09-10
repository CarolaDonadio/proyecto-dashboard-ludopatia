// Lógica de inicio/cierre de sesión

import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
const btnLogin = document.getElementById('btn-login');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  // Limpiar mensajes de error previos
  errorMessage.classList.add('hidden');
  errorMessage.textContent = '';
  
  // Feedback visual de carga
  btnLogin.disabled = true;
  btnLogin.textContent = 'Iniciando sesión...';

  try {
    // Autenticar con Firebase Auth
    await signInWithEmailAndPassword(auth, email, password);

    // Redirección exitosa al panel de administración
    window.location.href = 'dashboard.html';
  } catch (error) {
    btnLogin.disabled = false;
    btnLogin.textContent = 'Iniciar Sesión';
    
    errorMessage.classList.remove('hidden');

    // Traducir mensajes de error comunes de Firebase
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage.textContent = 'Correo o contraseña incorrectos.';
        break;
      case 'auth/too-many-requests':
        errorMessage.textContent = 'Demasiados intentos fallidos. Intenta más tarde.';
        break;
      default:
        errorMessage.textContent = 'Error al iniciar sesión. Inténtalo de nuevo.';
        console.error("Error de autenticación:", error);
    }
  }
});