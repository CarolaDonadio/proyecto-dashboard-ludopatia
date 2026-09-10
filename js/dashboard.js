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
    renderizarDetalles(encuestas);
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

const preguntasNo = [
  ['penso_hacerlo', '¿Alguna vez pensaste hacerlo?'],
  ['lo_haria_futuro', '¿Lo harías en el futuro?'],
  ['motivo_no_apostar', '¿Por qué decidís no apostar?'],
  ['conoce_alguien_que_apueste', '¿Conoces alguien que apueste?']
];

const preguntasSi = [
  ['tiempo_apostando', '¿Hace cuánto lo haces?'],
  ['familia_sabe', '¿Tu familia sabe que apuestas?'],
  ['motivo_inicio', '¿Por qué empezaste a jugar?'],
  ['origen_dinero', '¿Cómo conseguiste el dinero para apostar?'],
  ['monto_por_juego', '¿Qué cantidad apuestas cada vez que juegas?'],
  ['horas_semanales', '¿Cuántas horas juegas por semana?'],
  ['juegos_habituales', '¿En cuáles apuestas habitualmente?'],
  ['destino_ganancia', 'Si ganas, ¿qué haces con el dinero?'],
  ['conciencia_balance', '¿Sabes cuánto ganaste y cuánto perdiste?']
];

function renderizarDetalles(datos) {
  renderizarPreguntas('graficos-no', datos.filter(d => d.aposto === 'No'), 'detalle_no', preguntasNo);
  renderizarPreguntas('graficos-si', datos.filter(d => d.aposto === 'Sí'), 'detalle_si', preguntasSi);
}

function renderizarPreguntas(contenedorId, datos, detalleKey, preguntas) {
  const contenedor = document.getElementById(contenedorId);

  preguntas.forEach(([campo, titulo], indice) => {
    const card = document.createElement('div');
    card.className = 'chart-card';
    card.innerHTML = `<h3>${titulo}</h3><canvas id="${contenedorId}-${indice}"></canvas>`;
    contenedor.appendChild(card);

    const conteos = {};
    datos.forEach((encuesta) => {
      const respuesta = encuesta[detalleKey]?.[campo];
      const valores = Array.isArray(respuesta) ? respuesta : [respuesta];
      valores.filter(Boolean).forEach((valor) => {
        conteos[valor] = (conteos[valor] || 0) + 1;
      });
    });

    const canvas = card.querySelector('canvas');
    new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: Object.keys(conteos),
        datasets: [{
          label: 'Cantidad de respuestas',
          data: Object.values(conteos),
          backgroundColor: '#0284c7'
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        scales: { x: { beginAtZero: true, ticks: { precision: 0 } } }
      }
    });
  });
}