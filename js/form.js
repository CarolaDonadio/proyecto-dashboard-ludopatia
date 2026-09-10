// Lógica para capturar y enviar datos a Firestore

import { db } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const selectAposto = document.getElementById('aposto');
const seccionSi = document.getElementById('seccion-si');
const seccionNo = document.getElementById('seccion-no');
const form = document.getElementById('form-ludopatia');

function actualizarRamaActiva(valor) {
  const ramaSiActiva = valor === 'Sí';
  const ramaNoActiva = valor === 'No';

  seccionSi.classList.toggle('hidden', !ramaSiActiva);
  seccionNo.classList.toggle('hidden', !ramaNoActiva);

  seccionSi.querySelectorAll('select').forEach((campo) => {
    campo.required = ramaSiActiva;
  });
  seccionNo.querySelectorAll('select').forEach((campo) => {
    campo.required = ramaNoActiva;
  });
}

// Mostrar u ocultar preguntas dinámicamente según la respuesta 3
selectAposto.addEventListener('change', (e) => {
  actualizarRamaActiva(e.target.value);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const aposto = selectAposto.value;

  // 1. Capturar datos base obligatorios (Preguntas 1, 2 y 3)
  const respuestaData = {
    edad: parseInt(document.getElementById('edad').value, 10),
    sexo: document.getElementById('sexo').value,
    aposto: aposto,
    fecha_envio: serverTimestamp() // Registro de auditoría anónimo
  };

  // 2. Capturar rama de respuestas para "NO"
  if (aposto === 'No') {
    respuestaData.detalle_no = {
      penso_hacerlo: document.getElementById('no_penso').value,
      lo_haria_futuro: document.getElementById('no_futuro').value,
      motivo_no_apostar: document.getElementById('no_motivo').value,
      conoce_alguien_que_apueste: document.getElementById('no_conoce').value
    };
  }

  // 3. Capturar rama de respuestas para "SÍ"
  if (aposto === 'Sí') {
    // Capturar selección múltiple de juegos
    const juegosSeleccionados = Array.from(
      document.querySelectorAll('input[name="juegos"]:checked')
    ).map(cb => cb.value);

    if (juegosSeleccionados.length === 0) {
      alert('Selecciona al menos un tipo de juego.');
      return;
    }

    respuestaData.detalle_si = {
      tiempo_apostando: document.getElementById('si_tiempo').value,
      familia_sabe: document.getElementById('si_familia_sabe').value,
      motivo_inicio: document.getElementById('si_motivo').value,
      origen_dinero: document.getElementById('si_origen_dinero').value,
      monto_por_juego: document.getElementById('si_monto').value,
      horas_semanales: document.getElementById('si_horas').value,
      juegos_habituales: juegosSeleccionados, // Array con los juegos marcados
      destino_ganancia: document.getElementById('si_destino_ganancia').value,
      conciencia_balance: document.getElementById('si_balance').value
    };
  }

  // 4. Envío anónimo a Firestore
  try {
    const btnSubmit = document.getElementById('btn-submit');
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Enviando...';

    await addDoc(collection(db, "encuestas"), respuestaData);

    alert("¡Muchas gracias! Tu respuesta anónima ha sido registrada.");
    form.reset();
    
    // Ocultar las ramas condicionales al reiniciar el formulario
    actualizarRamaActiva('');
    
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'Enviar Encuesta Anónima';
  } catch (error) {
    console.error("Error al enviar la respuesta:", error);
    alert("Ocurrió un error al guardar la encuesta. Por favor, vuelve a intentarlo.");
    
    document.getElementById('btn-submit').disabled = false;
    document.getElementById('btn-submit').textContent = 'Enviar Encuesta Anónima';
  }
});