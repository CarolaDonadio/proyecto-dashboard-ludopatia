// Lógica para leer datos y renderizar los gráficos

import { db, auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 1. Proteger la ruta: solo administradores logueados pueden ver los datos
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'login.html';
  } else {
    cargarYRenderizarDatos();
  }
});

// Botón de cierre de sesión
document.getElementById('logout-btn')?.addEventListener('click', () => {
  signOut(auth).then(() => window.location.href = 'login.html');
});

// 2. Obtener datos de Firestore y dibujar gráficos
async function cargarYRenderizarDatos() {
  try {
    const querySnapshot = await getDocs(collection(db, "encuestas"));
    const encuestas = [];

    querySnapshot.forEach((doc) => {
      encuestas.push(doc.data());
    });

    renderizarGraficoEdad(encuestas);
    renderizarGraficoSexo(encuestas);
    renderizarGraficoAposto(encuestas);
  } catch (error) {
    console.error("Error al cargar datos del dashboard:", error);
  }
}

// Gráfica de Edades (Bar Chart)
function renderizarGraficoEdad(datos) {
  const edadesCount = { "12": 0, "13": 0, "14": 0, "15": 0, "16": 0, "17": 0 };
  
  datos.forEach(d => {
    if (d.edad && edadesCount[d.edad] !== undefined) {
      edadesCount[d.edad]++;
    }
  });

  const ctx = document.getElementById('chart-edad').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(edadesCount).map(e => `${e} años`),
      datasets: [{
        label: 'Cantidad de Respuestas',
        data: Object.values(edadesCount),
        backgroundColor: '#1976d2'
      }]
    },
    options: { responsive: true }
  });
}

// Gráfica de Sexo (Doughnut Chart)
function renderizarGraficoSexo(datos) {
  const sexoCount = { Femenino: 0, Masculino: 0, Otro: 0 };

  datos.forEach(d => {
    if (d.sexo && sexoCount[d.sexo] !== undefined) {
      sexoCount[d.sexo]++;
    }
  });

  const ctx = document.getElementById('chart-sexo').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(sexoCount),
      datasets: [{
        data: Object.values(sexoCount),
        backgroundColor: ['#0d47a1', '#1976d2', '#90caf9']
      }]
    },
    options: { responsive: true }
  });
}

// Gráfica de Apuestas (Pie Chart)
function renderizarGraficoAposto(datos) {
  const apostoCount = { Sí: 0, No: 0 };

  datos.forEach(d => {
    if (d.aposto && apostoCount[d.aposto] !== undefined) {
      apostoCount[d.aposto]++;
    }
  });

  const ctx = document.getElementById('chart-aposto').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(apostoCount),
      datasets: [{
        data: Object.values(apostoCount),
        backgroundColor: ['#1565c0', '#bbdefb']
      }]
    },
    options: { responsive: true }
  });
}